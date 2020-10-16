import {
  PriceItem,
  PricePC,
  PriceTMC,
  ProcessCardItem,
  TMCItem,
  ExpenseProduct,
  ExpenseService,
  ExpenseItem,
  ServiceItem,
  ExpenseRemittance,
} from "../domain/dictionary";
import { promisifyRequest } from "../lib/idbx";
import compact from 'lodash/fp/compact';

interface PriceByType {
  tmc: ReadonlyArray<PriceTMC>;
  pc: ReadonlyArray<PricePC>;
}

interface ExpenseByType {
  product: ReadonlyArray<ExpenseProduct>;
  service: ReadonlyArray<ExpenseService>;
  remittance: ReadonlyArray<ExpenseRemittance>;
}

export function separatePrice(prices: PriceItem[]) {
  return prices.reduce((a, v) => (
    { ...a, [v.type]: [...a[v.type], v] }
  ), { tmc: [], pc: [] } as PriceByType);
}

export async function priceZip(prices: PriceItem[], osTMC: IDBIndex, osPC: IDBObjectStore) {
  const { tmc, pc } = separatePrice(prices);
  const articles = await Promise.all(
    tmc.map(e => promisifyRequest<TMCItem>(osTMC.get(e.barcode)))
  );
  const processCards = await Promise.all(
    pc.map(e => promisifyRequest<ProcessCardItem>(osPC.get(e.refId)))
  )
  return {
    articles,
    processCards,
  }
}

export function separateExpense(list: ReadonlyArray<ExpenseItem>) {
  return list.reduce((a, v) => (
    { ...a, [v.type]: [...a[v.type], v] }
  ), { product: [], service: [], remittance: [] } as ExpenseByType);
}

export async function expenseZip(list: ReadonlyArray<ExpenseItem>, osTMC: IDBIndex, osServices: IDBObjectStore) {
  const { product, service } = separateExpense(list);
  const articles = await Promise.all(
    product.map(e => promisifyRequest<TMCItem>(osTMC.get(e.barcode)))
  );
  const services = await Promise.all(
    service.map(e => promisifyRequest<ServiceItem>(osServices.get(e.refId)))
  )

  return {
    articles: compact(articles),
    services: compact(services),
  }
}

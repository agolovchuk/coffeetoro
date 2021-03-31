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
import * as C from './constants';
import { getId } from 'lib/id'

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

export async function removeUserDuplicates(t: IDBTransaction) {
  const request = t.objectStore(C.TABLE.users.name).openCursor();
  const users: string[] = [];
  request.onsuccess = function (event) {
    const cursor: IDBCursorWithValue | null = this.result;
    if (cursor !== null) {
      const isExist = users.includes(cursor.value.name);
      if (!isExist && !cursor.value.active) {
        cursor.update({ ...cursor.value, name: getId(2, cursor.value.name) });
      }
      if (!isExist && cursor.value.active) {
        users.push(cursor.value.name);
      }
      if (isExist && !cursor.value.active) {
        cursor.delete();
      }
      if (isExist && cursor.value.active) {
        cursor.update({ ...cursor.value, name: getId(2, cursor.value.name) });
      }
      cursor.continue();
    }
  }
  request.onerror = () => {
    console.warn('removeUserDuplicates trouble');
  };
}

export function addDeviceId(t: IDBTransaction) {
  const request = t.objectStore(C.TABLE.env.name).openCursor();
  request.onsuccess = function (event) {
    console.log(event, '%%%');
    const cursor = this.result;
    if (cursor) {
      console.log(cursor.value, '$$$');
      cursor.update({ ...cursor.value, deviceId: getId(10) })
      cursor.continue()
    }
  }
  request.onerror = () => {
    console.warn('addDeviceId trouble');
  };
}

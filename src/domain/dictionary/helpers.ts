import get from 'lodash/get';
import {
  ProductForSale,
  PriceItem,
  Units,
  CategoryItem,
  TMC,
  ProcessCards,
  PriceExtendet,
} from './Types';

function priceAdapter(units: Units) {
  return (e: PriceExtendet) => ({
    price: e,
    volume: get(units, [e.unitId, 'title'], 'psc'),
  })
}

export function getProductForSale(category: CategoryItem, price: PriceExtendet[], units: Units): ProductForSale {
  return {
    ...category,
    valuation: price.map(priceAdapter(units))
  }
}

interface ISortebaleList {
  sortIndex: number;
}

export function sortByIndex<T extends ISortebaleList>(a: T, b: T) {
  return a.sortIndex - b.sortIndex;
}

/** Price */

function extendsPrice(price: PriceItem, tmc: TMC, pc: ProcessCards): PriceExtendet {
  if (price.type === 'tmc') {
    const { title, description, unitId } = tmc[price.barcode];
    return { ...price, title, description, unitId };
  }
  const { title, description } = pc[price.refId];
  return { ...price, title, description, unitId: '1' };
}

export function extendsPriceList(priceList: ReadonlyArray<PriceItem>, tmc: TMC, pc: ProcessCards) {
  const adapter = (price: PriceItem) => extendsPrice(price, tmc, pc)
  return priceList.map(adapter);
}

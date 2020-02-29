import {
  ProductForSale,
  PriceItem,
  Units,
  CategoryItem,
} from './Types';

function priceAdapter(units: Units) {
  return (e: PriceItem) => ({
    price: e,
    volume: units[e.unitId]?.title
  })
}

export function getProductForSale(category: CategoryItem, price: PriceItem[], units: Units): ProductForSale {
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
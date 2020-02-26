import {
  ProductForSale,
  ProductItem,
  PriceItem,
  Units,
} from './Types';

function priceAdapter(units: Units) {
  return (e: PriceItem) => ({
    price: e,
    volume: units[e.unitId]?.title
  })
}

function getProductForSale<T>(
  price: Map<string, ReadonlyArray<PriceItem>>,
  units: Units,
  merger: (cont: Readonly<T>, p: ProductForSale) => Readonly<T>,
) {
  return (def: Readonly<T>, { id, title, name }: ProductItem) => {
    const vl = price.get(name);
    if (vl) {
      const valuation = vl.map(priceAdapter(units))
      return merger(def, { id, title, name, valuation })
    }
    return def;
  }
}

export function getProductsForSaleList(
  products: ReadonlyArray<ProductItem>,
  price: Map<string, ReadonlyArray<PriceItem>>,
  units: Units,
  merger: (d: ReadonlyArray<ProductForSale>, s: ProductForSale) => ReadonlyArray<ProductForSale>,
): ReadonlyArray<ProductForSale> {
  const def = [] as ReadonlyArray<ProductForSale>;
  const ad = getProductForSale(price, units, merger);
  return products.reduce((a, product) => ad(a, product), def);
}

export function getProductsForSale(
  products: ReadonlyArray<ProductItem>,
  price: Map<string, ReadonlyArray<PriceItem>>,
  units: Units,
  merger: (d: Record<string, ProductForSale>, s: ProductForSale) => Record<string, ProductForSale>,
): Record<string, ProductForSale> {
  const def = {} as Record<string, ProductForSale>;
  const ad = getProductForSale(price, units, merger);
  return products.reduce((a, product) => ad(a, product), def);
}

interface ISortebaleList {
  sortIndex: number;
}

export function sortByIndex<T extends ISortebaleList>(a: T, b: T) {
  return a.sortIndex - b.sortIndex;
}
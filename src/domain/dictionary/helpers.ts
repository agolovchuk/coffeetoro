import { ObjectMap } from 'lib/dataHelper';
import {
  ProductForSale,
  ProductItem,
  PriceItem,
  Volume,
} from './Types';

interface ProductIndex {
  readonly productName: string;
  readonly volumeId: string;
}

function productHash({ productName, volumeId }: ProductIndex) {
  return productName + '@' + volumeId;
}

export function indexedPrice(prices: ReadonlyArray<PriceItem>) {
  const def = new ObjectMap<ProductIndex, PriceItem>(productHash);
  return prices.reduce((a, v) => a.set({
    productName: v.productName,
    volumeId: v.volumeId,
  }, v), def);
}

function priceAdapter(volume: Volume) {
  return (e: PriceItem) => ({
    price: e,
    volume: volume[e.volumeId].title
  })
}

function getProductForSale<T>(
  price: Map<string, ReadonlyArray<PriceItem>>,
  volume: Volume,
  merger: (cont: Readonly<T>, p: ProductForSale) => Readonly<T>,
) {
  return (def: Readonly<T>, { id, title, name }: ProductItem) => {
    const vl = price.get(name);
    if (vl) {
      const valuation = vl.map(priceAdapter(volume))
      return merger(def, { id, title, name, valuation })
    }
    return def;
  }
}

export function getProductsForSaleList(
  products: ReadonlyArray<ProductItem>,
  price: Map<string, ReadonlyArray<PriceItem>>,
  volume: Volume,
  merger: (d: ReadonlyArray<ProductForSale>, s: ProductForSale) => ReadonlyArray<ProductForSale>,
): ReadonlyArray<ProductForSale> {
  const def = [] as ReadonlyArray<ProductForSale>;
  const ad = getProductForSale(price, volume, merger);
  return products.reduce((a, product) => ad(a, product), def);
}

export function getProductsForSale(
  products: ReadonlyArray<ProductItem>,
  price: Map<string, ReadonlyArray<PriceItem>>,
  volume: Volume,
  merger: (d: Record<string, ProductForSale>, s: ProductForSale) => Record<string, ProductForSale>,
): Record<string, ProductForSale> {
  const def = {} as Record<string, ProductForSale>;
  const ad = getProductForSale(price, volume, merger);
  return products.reduce((a, product) => ad(a, product), def);
}

interface ISortebaleList {
  sortIndex: number;
}

export function sortByIndex<T extends ISortebaleList>(a: T, b: T) {
  return a.sortIndex - b.sortIndex;
}
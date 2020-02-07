import { createSelector } from 'reselect';
import { DictionaryState, ProductForSale } from './Types';
import { params } from 'domain/routes';
import { groupBy, arrayToMap, arrayMerge } from 'lib/dataHelper';
import { getProductsForSaleList, indexedPrice, getProductsForSale, sortByIndex } from './helpers';

const categories = (state: DictionaryState) => state.categories;
const products = (state: DictionaryState) => state.products;
const prices = (state: DictionaryState) => state.prices;
export const volume = (state: DictionaryState) => state.volume;

export const currentCategorySelector = createSelector(
  [categories, params],
  (c, p) => c.filter(f => f.parentName === p.category).sort(sortByIndex),
)

export const productsSelector = createSelector(
  [products, params],
  (pr, p) => pr.filter(f => f.categoryName === p.category),
)

export const productsWithNameSelector = createSelector(
  [products, params],
  (pr, p) => pr.filter(f => f.name === p.product),
)

export const productByName = createSelector(
  [products],
  p => arrayToMap(p, 'name'),
)

const priceByProductSelector = createSelector(
  prices,
  (p) => groupBy(p, 'productName')
)

export const indexedPriceSelector = createSelector(
  [prices],
  p => indexedPrice(p),
)

export const priceByID = createSelector(
  [prices],
  p => arrayToMap(p, 'id'),
)

export const productItemSelector = createSelector(
  [productsWithNameSelector, priceByProductSelector, volume],
  (pr, prs, v) => getProductsForSaleList(pr, prs, v, arrayMerge),
)

const mergeByName = (o: Record<string, ProductForSale>, item: ProductForSale) => {
  const id = item.name;
  return { ...o, [id]: item };
}

export const productItemByNameSelector = createSelector(
  [productsWithNameSelector, priceByProductSelector, volume],
  (pr, prs, v) => getProductsForSale(pr, prs, v, mergeByName),
)

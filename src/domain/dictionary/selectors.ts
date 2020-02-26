import { createSelector } from 'reselect';
import { DictionaryState, ProductForSale } from './Types';
import { params } from 'domain/routes';
import { groupBy, arrayToMap, arrayMerge } from 'lib/dataHelper';
import { getProductsForSaleList, indexedPrice, getProductsForSale, sortByIndex } from './helpers';

const categories = (state: DictionaryState) => state.categories;
const products = (state: DictionaryState) => state.products;
const prices = (state: DictionaryState) => state.prices;
export const units = (state: DictionaryState) => state.units;
// export const volume = (state: DictionaryState) => state.volume;

export const categoriesListSelector = createSelector(categories, c => Object.values(c).sort(sortByIndex));
export const productsListSelector = createSelector(products, c => Object.values(c).sort(sortByIndex));
export const pricesListSelector = createSelector(prices, c => Object.values(c).sort(sortByIndex));
export const unitsListSelector = createSelector(units, c => Object.values(c).sort(sortByIndex));

export const priceByNameSelector = createSelector(products, p => p);
export const unitsByIdSelector = createSelector(units, u => u);

export const currentCategorySelector = createSelector(
  [categoriesListSelector, params],
  (c, p) => c.filter(f => f.name === p.category).sort(sortByIndex),
)

export const productsSelector = createSelector(
  [productsListSelector, params],
  (pr, p) => pr.filter(f => f.categoryName === p.category),
)

export const productsWithNameSelector = createSelector(
  [productsListSelector, params],
  (pr, p) => pr.filter(f => f.name === p.product),
)

export const productByName = createSelector(
  [productsListSelector],
  p => arrayToMap(p, 'name'),
)

const priceByProductSelector = createSelector(
  pricesListSelector,
  (p) => groupBy(p, 'productName')
)

export const indexedPriceSelector = createSelector(
  [pricesListSelector],
  p => indexedPrice(p),
)

export const priceByID = createSelector(
  [pricesListSelector],
  p => arrayToMap(p, 'id'),
)

export const productItemSelector = createSelector(
  [productsWithNameSelector, priceByProductSelector, units],
  (pr, prs, v) => getProductsForSaleList(pr, prs, v, arrayMerge),
)

const mergeByName = (o: Record<string, ProductForSale>, item: ProductForSale) => {
  const id = item.name;
  return { ...o, [id]: item };
}

export const productItemByNameSelector = createSelector(
  [productsWithNameSelector, priceByProductSelector, units],
  (pr, prs, v) => getProductsForSale(pr, prs, v, mergeByName),
)

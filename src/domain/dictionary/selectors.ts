import { createSelector } from 'reselect';
import get from 'lodash/get';
import { DictionaryState, CategoryItem } from './Types';
import { params } from 'domain/routes';
import {
  getProductForSale,
  sortByIndex,
} from './helpers';

const categories = (state: DictionaryState) => state.categories;
const prices = (state: DictionaryState) => state.prices;
export const units = (state: DictionaryState) => state.units;

export const categoriesListSelector = createSelector(categories, c => Object.values(c).sort(sortByIndex));
export const pricesListSelector = createSelector(prices, c => Object.values(c).sort(sortByIndex));
export const unitsListSelector = createSelector(units, c => Object.values(c).sort(sortByIndex));

export const unitsByIdSelector = createSelector(units, u => u);

export const currentCategorySelector = createSelector(
  [categories, params],
  (c, p) => p.category ? get(c, p.category, {} as CategoryItem) : {} as CategoryItem,
)

export const currentCategoriesSelector = createSelector(
  [categoriesListSelector, params],
  (c, p) => c.filter(f => f.parentName === (p.category || 'root')),
)

export const priceByNameSelector = createSelector(prices, p => p);

const priceCategorySelector = createSelector(
  [pricesListSelector, params],
  (pr, p) => pr.filter(f => f.categoryName === p.category),
)

export const productItemSelector = createSelector(
  [currentCategorySelector, priceCategorySelector, units],
  getProductForSale
)

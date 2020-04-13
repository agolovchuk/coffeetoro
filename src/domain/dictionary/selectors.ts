import { createSelector } from 'reselect';
import get from 'lodash/get';
import { arrayToRecord } from 'lib/dataHelper';
import { DictionaryState, CategoryItem } from './Types';
import { params } from 'domain/routes';
import {
  getProductForSale,
  sortByIndex,
  extendsPriceList,
} from './helpers';

const categories = (state: DictionaryState) => state.categories;
const prices = (state: DictionaryState) => state.prices;
export const units = (state: DictionaryState) => state.units;
const tmc = (state: DictionaryState) => state.tmc;
const processCards = (state: DictionaryState) => state.processCards;

export const categoriesListSelector = createSelector(categories, c => Object.values(c).sort(sortByIndex));
export const pricesListSelector = createSelector(prices, c => Object.values(c).sort(sortByIndex));
export const unitsListSelector = createSelector(units, c => Object.values(c).sort(sortByIndex));
export const tmcListSelector = createSelector(tmc, c => Object.values(c));
export const processCardsListSelector = createSelector(processCards, c => Object.values(c));

export const unitsByIdSelector = createSelector(units, u => u);
export const unitsSelectSelector = createSelector(
  [unitsListSelector],
  u => u.map(({ id, title }) => ({ name: id, title }))
);

export const articlesByBarcodeSelector = createSelector(tmcListSelector, a => arrayToRecord(a, 'barcode'));

const priceCategorySelector = createSelector(
  [pricesListSelector, params],
  (pr, p) => pr.filter(f => f.parentId === p.categoryId),
)

export const extendetPricesSelector = createSelector(
  [priceCategorySelector, articlesByBarcodeSelector, processCards],
  extendsPriceList,
);

export const categoryByNameSelector = createSelector(categories, c => c);

export const currentCategorySelector = createSelector(
  [categories, params],
  (c, p) => p.categoryId ? get(c, p.categoryId, {} as CategoryItem) : {} as CategoryItem,
)

export const currentCategoriesSelector = createSelector(
  [categoriesListSelector, params],
  (c, p) => c.filter(f => f.parentId === (p.categoryId || 'root')),
)

export const priceByNameSelector = createSelector(prices, p => p);

export const productItemSelector = createSelector(
  [currentCategorySelector, extendetPricesSelector, units],
  getProductForSale
)

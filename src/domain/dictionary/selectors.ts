import { createSelector } from 'reselect';
import get from 'lodash/get';
import { arrayToRecord, toArray } from 'lib/dataHelper';
import { DictionaryState, CategoryItem, CountedCategoryItem, EGroupName } from './Types';
import { params } from 'domain/routes';
import { userSelector } from 'domain/env';
import {
  getProductForSale,
  sortByIndex,
  extendsPriceList,
  pcFill,
  groupFill,
  extendsExpanseList,
  expenseByUser,
} from './helpers';
import { AppState } from "../StoreType";

const categories = (state: DictionaryState) => state.categories;
const prices = (state: DictionaryState) => state.prices;
export const units = (state: DictionaryState) => state.units;
const tmc = (state: DictionaryState) => state.tmc;
export const processCards = (state: DictionaryState) => state.processCards;
const groupArticles = (state: DictionaryState) => state.groupArticles;
const expenses = (state: DictionaryState) => state.expenses;
const services = (state: DictionaryState) => state.services;
const account = (state: DictionaryState) => state.account;

const groupSelector = (state: AppState, group: EGroupName) => group;

export const categoriesListSelector = createSelector(categories, c => Object.values(c).sort(sortByIndex));

export const categoryGroupListSelector = createSelector(
  [categoriesListSelector, groupSelector],
  (c, g) => c.filter(f => f.group === g)
);

export const pricesListSelector = createSelector(prices, c => Object.values(c).sort(sortByIndex));
export const unitsListSelector = createSelector(units, c => Object.values(c).sort(sortByIndex));
export const tmcListSelector = createSelector(tmc, toArray);
export const processCardsListSelector = createSelector(processCards, toArray);
export const groupArticlesListSelector = createSelector(groupArticles, toArray);
export const expensesListSelector = createSelector(expenses, toArray);
export const servicesListSelector = createSelector(services, toArray);
export const accountListSelector = createSelector(account, toArray);

export const unitsByIdSelector = createSelector(units, u => u);
export const unitsSelectSelector = createSelector(
  [unitsListSelector],
  u => u.map(({ id, title }) => ({ name: id, title }))
);

export const articlesByBarcodeSelector = createSelector(tmcListSelector, a => arrayToRecord(a, 'barcode'));

const priceCategorySelector = createSelector(
  [pricesListSelector, params],
  (pr, p) => pr.filter(f => f.parentId === p.categoryId),
);

export const extendedPricesSelector = createSelector(
  [priceCategorySelector, articlesByBarcodeSelector, processCards],
  extendsPriceList,
);

export const categoryByNameSelector = createSelector(categories, c => c);

export const currentCategorySelector = createSelector(
  [categories, params],
  (c, p) => p.categoryId ? get(c, p.categoryId, {} as CategoryItem) : {} as CategoryItem,
);

export const currentCategoriesSelector = createSelector(
  [categoriesListSelector, params],
  (c: ReadonlyArray<CountedCategoryItem>, p) => c.filter(f => f.parentId === (p.categoryId || EGroupName.PRICES)),
);

export const priceByNameSelector = createSelector(prices, p => p);

export const productItemSelector = createSelector(
  [currentCategorySelector, extendedPricesSelector, units],
  getProductForSale
);

export const processCardSelector = createSelector(
  [processCards, tmc, params],
  (pc, t, p) => p.pcId ? pcFill(get(pc, p.pcId), t) : undefined,
);

export const groupArticlesSelector = createSelector(
  [groupArticles, tmc, params],
  (g, t, p) => p.groupId ? groupFill(get(g, p.groupId), t) : undefined,
);

export const extendedExpanseSelector = createSelector(
  [expensesListSelector, articlesByBarcodeSelector, services],
  (e, tmc, s) => extendsExpanseList(e, tmc, s)
);

export const extendedExpanseByUserSelector = createSelector(
  [extendedExpanseSelector, userSelector],
  (ex, u) => expenseByUser(ex, u),
);

// export const balanceListSelector = createSelector(
//   [expensesListSelector],
//   (b) => Object
//     .entries(groupBy(b, 'foreignId'))
//     .reduce((a, [id, v]) => [...a, {
//       id,
//       ...pick(get(v, 0), ['date', 'createBy', 'source', 'about']),
//       summa: summa(v),
//     }], [] as DocumentGroup[]),
// );

export const balanceListSelector = createSelector([], () => []);

export const expanseSumSelector = createSelector(
  [expensesListSelector],
  e => e.reduce((a, v) => ({
    ...a,
    [v.source]: get(a, v.source, 0) + (v.valuation * get(v, 'quantity', 1)),
  }), {}),
);

export const enabledAccountsSelector = createSelector(accountListSelector, a => a.filter(f => f.active === true));

export const paymentMethodsSelector = createSelector(enabledAccountsSelector, a => a.filter(f => f.payInOrder));

export const accountsByIdSelector = createSelector(account, a => a);

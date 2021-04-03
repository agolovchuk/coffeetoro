import { startOfDay, endOfDay, startOfMonth } from 'date-fns';
import { validateArray } from 'lib/contracts';
import CDB, { promisifyRequest } from 'db';
import * as C from 'db/constants';
import { ThunkAction } from '../StoreType';
import * as CRUD from './crud';
import {
  CategoryItem,
  PriceItem,
  CountedCategoryItem,
  TMCItem,
  ProcessCardItem,
  GroupArticles,
  Expenses, ServiceItem,
} from './Types';
import * as adapters from './adapters';
// import { CREATE_ACCOUNT } from './constants';

export { CRUD }

export const PUT_ARTICLES = 'DICTIONARY/PUT_ARTICLES';

export const GET_CATEGORIES_SUCCESS = 'DICTIONARY/GET_CATEGORIES_SUCCESS';
export const GET_PRICES_SUCCESS = 'DICTIONARY/GET_PRICES_SUCCESS';
export const GET_PRICES_FAILURE = 'DICTIONARY/GET_PRICES_FAILURE';

export const CREATE_PRICE = 'DICTIONARY/CREATE_PRICE';
export const UPDATE_PRICE = 'DICTIONARY/UPDATE_PRICE';

export const GET_CATEGORY = 'DICTIONARY/GET_CATEGORY';
export const CREATE_CATEGORY = 'DICTIONARY/CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'DICTIONARY/UPDATE_CATEGORY';

export const GET_PROCESS_CARD = 'DICTIONARY/GET_PROCESS_CARD';

export const GRT_GROUP_ARTICLES = 'DICTIONARY/GRT_GROUP_ARTICLES';

export const GET_EXPENSE = 'DICTIONARY/GET_EXPENSE';

export interface GetCategoriesSuccess {
  type: typeof GET_CATEGORIES_SUCCESS;
  payload: Record<string, CountedCategoryItem>;
}

type CategoryIndex = 'name' | 'parentId' | 'group';

export function getPriceCategoriesAction(index: CategoryIndex, query?: string): ThunkAction<GetCategoriesSuccess> {
  return async(dispatch) => {
    const Idb = new CDB();
    const db = await Idb.open();
    let categories: CategoryItem[];
    let counters: number[];
    const transaction = db.transaction(['categories', 'prices']);
    transaction.oncomplete = function() {
      db.close();
      categories = categories.map((e, i) => ({ ...e, count: counters[i] }));
      dispatch({
        type: GET_CATEGORIES_SUCCESS,
        payload: validateArray(adapters.categories)(categories),
      });
    }
    const categoryStore = transaction.objectStore('categories');
    const priceStore = transaction.objectStore('prices');
    categories = await promisifyRequest<CategoryItem[]>(categoryStore.index(index).getAll(query));
    counters = await Promise.all(
      categories.map(({ id }) => promisifyRequest<number>(priceStore.index('parentId').count(id)))
    )
  };
}

export function getCategoriesAction(index: CategoryIndex, query?: string): ThunkAction<GetCategoriesSuccess> {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      const db = await Idb.open();
      const transaction = db.transaction(['categories']);
      const categoryStore = transaction.objectStore('categories');
      const categories = await promisifyRequest<CategoryItem[]>(categoryStore.index(index).getAll(query));
      dispatch({
        type: GET_CATEGORIES_SUCCESS,
        payload: validateArray(adapters.categories)(categories),
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface GetPricesSuccess {
  type: typeof GET_PRICES_SUCCESS;
  payload: {
    prices: Record<string, PriceItem>;
    articles: Record<string, TMCItem>;
    processCards: Record<string, ProcessCardItem>
  }
}

export interface GetPricesFailure {
  type: typeof GET_PRICES_FAILURE;
  err: any;
}

export function getPricesByCategoryAction(categoryId: string): ThunkAction<GetPricesSuccess> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      const { prices, articles, processCards } = await idb.getPricesByCategory(categoryId);
      dispatch({
        type: GET_PRICES_SUCCESS,
        payload: {
          prices: adapters.pricesToDictionary(prices),
          articles: adapters.articlesToDictionary(articles),
          processCards: adapters.pcToDictionary(processCards),
        }
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface CreatePrice {
  type: typeof CREATE_PRICE;
  payload: PriceItem;
}

export function createPriceAction(item: PriceItem): ThunkAction<CreatePrice>  {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      await Idb.addItem(C.TABLE.price.name, item);
      dispatch({
        type: CREATE_PRICE,
        payload: item,
      })
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface UpdatePrice {
  type: typeof UPDATE_PRICE;
  payload: PriceItem;
}

export function updatePriceAction(item: PriceItem): ThunkAction<UpdatePrice> {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      await Idb.updateItem(C.TABLE.price.name, item);
      dispatch({
        type: UPDATE_PRICE,
        payload: item,
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface CreateCategory {
  type: typeof CREATE_CATEGORY;
  payload: CountedCategoryItem;
}

export function createCategoryAction({ count, ...item }: CountedCategoryItem): ThunkAction<CreateCategory> {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      await Idb.addItem(C.TABLE.category.name, item);
      dispatch({
        type: CREATE_CATEGORY,
        payload: { ...item, count },
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface UpdateCategory {
  type: typeof UPDATE_CATEGORY;
  payload: CountedCategoryItem;
}

export function updateCategory({ count, ...item }: CountedCategoryItem): ThunkAction<UpdateCategory> {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      await Idb.updateItem(C.TABLE.category.name, item);
      dispatch({
        type: UPDATE_CATEGORY,
        payload: { ...item, count },
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface GetCategory {
  type: typeof GET_CATEGORY;
  payload: CategoryItem;
}

export function getCategoryAction(id: string): ThunkAction<GetCategory> {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      const category = await Idb.getItem(C.TABLE.category.name, adapters.categoryAdapter, id);
      if (category) {
        dispatch({
          type: GET_CATEGORY,
          payload: category,
        })
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface GetProcessCard {
  type: typeof GET_PROCESS_CARD;
  payload: {
    processCard: ProcessCardItem,
    articles: Record<string, TMCItem>
  }
}

export function getProcessCardAction(pcId: string): ThunkAction<GetProcessCard> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      const { processCard, articles } = await idb.getProcessCard(pcId);
      if (processCard) {
        dispatch({
          type: GET_PROCESS_CARD,
          payload: {
            processCard,
            articles: adapters.articlesToDictionary(articles),
          }
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface GetGroupArticles {
  type: typeof GRT_GROUP_ARTICLES;
  payload: {
    groupArticles: GroupArticles,
    articles: Record<string, TMCItem>;
  }
}

export function getGroupArticlesAction(groupId: string): ThunkAction<GetGroupArticles> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      const { groupArticles, articles } = await idb.getGroupArticles(groupId);
      if (groupArticles) {
        dispatch({
          type: GRT_GROUP_ARTICLES,
          payload: {
            groupArticles,
            articles: adapters.articlesToDictionary(articles)
          }
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface PutArticles {
  type: typeof PUT_ARTICLES;
  payload: Record<string, TMCItem>;
}

export function putArticlesAction(articles: ReadonlyArray<TMCItem>) {
  return {
    type: PUT_ARTICLES,
    payload: adapters.articlesToDictionary(articles),
  };
}

export interface GetExpense {
  type: typeof GET_EXPENSE;
  payload: {
    expenses: Expenses,
    articles: Record<string, TMCItem>;
    services: Record<string, ServiceItem>
  }
}

export function getExpenseAction(f?: string, t?: string): ThunkAction<GetExpense> {
  const from = f ? startOfDay(new Date(f)) : startOfMonth(new Date());
  const to = t ? endOfDay(new Date(t)) : endOfDay(new Date());
  return async (dispatch) => {
    const idb = new CDB();
    const { expenses, articles, services } = await idb.getExpense(from, to);
    dispatch({
      type: GET_EXPENSE,
      payload: {
        expenses: adapters.expensesToDictionary(expenses),
        articles: adapters.articlesToDictionary(articles),
        services: adapters.servicesToDictionary(services),
      }
    });
  }
}

export type Action = ReturnType<typeof CRUD.createItemAction>
  | ReturnType<typeof CRUD.getAllAction>
  | ReturnType<typeof CRUD.getAllActionSuccess>
  | ReturnType<typeof CRUD.updateItemAction>
  | GetCategoriesSuccess
  | GetPricesSuccess
  | GetPricesFailure
  | UpdatePrice
  | CreatePrice
  | GetCategory
  | CreateCategory
  | UpdateCategory
  | GetProcessCard
  | GetGroupArticles
  | PutArticles
  | GetExpense
  ;

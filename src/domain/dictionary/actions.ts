import { ThunkAction } from 'redux-thunk';
import { validateArray } from 'lib/contracts';
import CDB, { promisifyReques } from 'db';
import * as C from 'db/constants';
import { AppState } from '../StoreType';
import * as CRUD from './crud';
import { CategoryItem, PriceItem } from './Types';
import * as adapters from './adapters';

export { CRUD }

export const GET_CATEGORIES_SUCCESS = 'DICTIONARY/GET_CATEGORIES_SUCCESS';
export const GET_PRICES_SUCCESS = 'DICTIONARY/GET_PRICES_SUCCESS';
export const GET_PRICES_FAILURE = 'DICTIONARY/GET_PRICES_FAILURE';
export const CREATE_PRICE = 'DICTIONARY/CREATE_PRICE';
export const UPDATE_PRICE = 'DICTIONARY/UPDATE_PRICE';
export const CREATE_CATEGORY = 'DICTIONARY/CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'DICTIONARY/UPDATE_CATEGORY';

export interface GetCategoriesSuccess {
  type: typeof GET_CATEGORIES_SUCCESS;
  payload: Record<string, CategoryItem>;
}

type CategoryIndex = 'name' | 'parentId';

export function getCategoriesAction(index: CategoryIndex, query?: string): ThunkAction<void, AppState, unknown, GetCategoriesSuccess> {
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
    categories = await promisifyReques<CategoryItem[]>(categoryStore.index(index).getAll(query));
    counters = await Promise.all(
      categories.map(({ id }) => promisifyReques<number>(priceStore.index('categoryId').count(id)))
    )
  };
};

export function getChildrenCategoryAction(name: string): ThunkAction<void, AppState, unknown, GetCategoriesSuccess> {
  return async(dispatch) => {
    try {
      const dbx = new CDB();
      const db = await dbx.open();
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
      const { id } = await promisifyReques<CategoryItem>(categoryStore.index('name').get(name));
      categories = await promisifyReques<CategoryItem[]>(categoryStore.index('parentId').getAll(id));
      counters = await Promise.all(
        categories.map(({ name }) => promisifyReques<number>(priceStore.index('categoryId').count(name))),
      );
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface GetPricesSuccess {
  type: typeof GET_PRICES_SUCCESS;
  payload: {
    prices: Record<string, PriceItem>;
    category: Record<string, CategoryItem>;
  }
}

export interface GetPricesFailure {
  type: typeof GET_PRICES_FAILURE;
  err: any;
}

export function getPricesAction(categoryId: string): ThunkAction<void, AppState, unknown, GetPricesSuccess | GetPricesFailure> {
  return async(dispatch) => {
    const Idb = new CDB();
    let c: CategoryItem;
    let p: PriceItem[] = [];
    try {
      const db = await Idb.open();
      const transaction = db.transaction(['categories', 'prices']);
      transaction.oncomplete = function() {
        db.close();
        const category = adapters.categories({}, { ...c, count: p.length });
        const prices = validateArray(adapters.prices)(p);
        if (category === null) throw new TypeError('Category null');
          dispatch({ type: GET_PRICES_SUCCESS, payload: { prices, category } });
      }
      const categoryStore = transaction.objectStore('categories');
      const priceStore = transaction.objectStore('prices');
  
      c = await promisifyReques<CategoryItem>(categoryStore.get(categoryId));
      p = await promisifyReques<PriceItem[]>(priceStore.index('categoryId').getAll(categoryId));
    } catch (err) {
      dispatch({ type: GET_PRICES_FAILURE, err });
    }
  }
}

export interface CreatePrice {
  type: typeof CREATE_PRICE;
  payload: PriceItem;
}

export function createPriceAction(item: PriceItem): ThunkAction<void, AppState, unknown, CreatePrice>  {
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

export function updatePriceAction(item: PriceItem): ThunkAction<void, AppState, unknown, UpdatePrice> {
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
  payload: CategoryItem;
}

export function createCategoryAction(item: CategoryItem): ThunkAction<void, AppState, unknown, CreateCategory> {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      await Idb.addItem(C.TABLE.category.name, item);
      dispatch({
        type: CREATE_CATEGORY,
        payload: item,
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface UpdateCategory {
  type: typeof UPDATE_CATEGORY;
  payload: CategoryItem;
};

export function updateCategory(item: CategoryItem): ThunkAction<void, AppState, unknown, UpdateCategory> {
  return async(dispatch) => {
    try {
      const Idb = new CDB();
      await Idb.updateItem(C.TABLE.category.name, item);
      dispatch({
        type: UPDATE_CATEGORY,
        payload: item,
      });
    } catch (err) {
      console.warn(err);
    }
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
  | CreateCategory
  | UpdateCategory
  ;
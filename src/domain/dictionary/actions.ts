import { ThunkAction } from 'redux-thunk';
import { validateArray } from 'lib/contracts';
import CDB, { promisifyReques } from 'db';
import { AppState } from '../StoreType';
import * as CRUD from './crud';
import { CategoryItem, PriceItem } from './Types';
import * as adapters from './adapters';

export { CRUD }

export const GET_CATEGORIES_SUCCESS = 'DICTIONARY/GET_CATEGORIES_SUCCESS';
export const GET_PRICES_SUCCESS = 'DICTIONARY/GET_PRICES_SUCCESS';
export const GET_PRICES_FAILURE = 'DICTIONARY/GET_PRICES_FAILURE';

export interface GetCategoriesSuccess {
  type: typeof GET_CATEGORIES_SUCCESS;
  payload: Record<string, CategoryItem>;
}

type CategoryIndex = 'name' | 'parentName';

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
      categories.map(({ name }) => promisifyReques<number>(priceStore.index('categoryName').count(name))),
    );
  } 
};

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

export function getPricesAction(categoryName: string): ThunkAction<void, AppState, unknown, GetPricesSuccess | GetPricesFailure> {
  return async(dispatch) => {
    const Idb = new CDB();
    let c: CategoryItem;
    let p: PriceItem[];
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
  
      c = await promisifyReques<CategoryItem>(categoryStore.index('name').get(categoryName));
      p = await promisifyReques<PriceItem[]>(priceStore.index('categoryName').getAll(categoryName));
    } catch (err) {
      dispatch({ type: GET_PRICES_FAILURE, err });
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
  ;
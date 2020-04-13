import { validateArray } from 'lib/contracts';
import CDB, { promisifyReques } from 'db';
import * as C from 'db/constants';
import { ThunkAction } from '../StoreType';
import * as CRUD from './crud';
import { CategoryItem, PriceItem, CountedCategoryItem, TMCItem, ProcessCardItem } from './Types';
import * as adapters from './adapters';

export { CRUD }

export const GET_CATEGORIES_SUCCESS = 'DICTIONARY/GET_CATEGORIES_SUCCESS';
export const GET_PRICES_SUCCESS = 'DICTIONARY/GET_PRICES_SUCCESS';
export const GET_PRICES_FAILURE = 'DICTIONARY/GET_PRICES_FAILURE';

export const CREATE_PRICE = 'DICTIONARY/CREATE_PRICE';
export const UPDATE_PRICE = 'DICTIONARY/UPDATE_PRICE';

export const GET_CATEGORY = 'DICTIONARY/GET_CATEGORY';
export const CREATE_CATEGORY = 'DICTIONARY/CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'DICTIONARY/UPDATE_CATEGORY';

export interface GetCategoriesSuccess {
  type: typeof GET_CATEGORIES_SUCCESS;
  payload: Record<string, CountedCategoryItem>;
}

type CategoryIndex = 'name' | 'parentId';

export function getCategoriesAction(index: CategoryIndex, query?: string): ThunkAction<GetCategoriesSuccess> {
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
      categories.map(({ id }) => promisifyReques<number>(priceStore.index('parentId').count(id)))
    )
  };
};

export function getChildrenCategoryAction(name: string): ThunkAction<GetCategoriesSuccess> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      const db = await idb.open();
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
};

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
  ;
import eq from 'deep-equal';
import CDB from 'db';
import * as C from 'db/constants';
import { Adapter, IDB } from 'lib/idbx';
import * as adapters from 'domain/dictionary/adapters';
import { PriceItem, CategoryItem } from 'domain/dictionary/Types';

interface PriceContainer {
  id: string,
  add: string;
  expiry?: string;
  parentId: string;
  valuation: number;
  sortIndex: number;
}

type FBPriceItem = PriceContainer & {
  type: 'tmc';
  barcode: string;
} | PriceContainer & {
  type: 'pc';
  refId: string;
};

type FBCategory = Omit<CategoryItem, 'count'>;

interface DBWrapper<T, F> {
  get: (key: string) => Promise<T | null>,
  set: (data: F) => Promise<void>,
  put: (data: F) => Promise<void>,
}

export function eqPrice(fBPrice: FBPriceItem, { add, expiry, ...dbp }: PriceItem) {
  return eq({
    ...dbp,
    add: add.toISOString(),
  }, fBPrice);
}

export function eqCategory(fbCategory: FBCategory, dbc: CategoryItem) {
  return eq(dbc, fbCategory);
}

function dbWrapper<T, F>(table: string, adapter: Adapter<T>): DBWrapper<T, F> {
  const dbx = (): IDB => new CDB();
  return {
    get: (key: string) => dbx().getItem(table, adapter, key),
    set: (data: F) => dbx().addItem(table, data),
    put: (data: F) => dbx().updateItem(table, data),
  };
}

function handlerFactory<I, F>(
  dbw: DBWrapper<I, F>,
  equal: (f: F, i: I) => boolean,
  action: (f: F) => void,
) {
  return async(s: firebase.database.DataSnapshot) => {
    try {
      if (typeof s.key === 'string') {
        const data = s.val();
        const p = await dbw.get(s.key);
        if (p === null || !equal(data, p)) {
          action(data);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

const priceDB = dbWrapper(C.TABLE.price.name, adapters.priceAdapter);

function priceFBtoiDB({ expiry, add, ...data}: FBPriceItem): PriceItem {
  return {
    ...data,
    add: new Date(add),
    expiry: expiry ? new Date(expiry) : null,
  }
};

export const addPriceHandler = handlerFactory(
  priceDB,
  eqPrice,
  async (data) => { priceDB.set(priceFBtoiDB(data)); }
);

export const changePriceHandler = handlerFactory(
  priceDB,
  eqPrice,
  async (data) => { priceDB.put(priceFBtoiDB(data)); }
);

const categoryDB = dbWrapper(C.TABLE.category.name, adapters.categoryAdapter);

export const addCategoryHandler = handlerFactory(
  categoryDB,
  eqCategory,
  async (data) => { categoryDB.set(data); }
);

export const changeCategoryHandler = handlerFactory(
  categoryDB,
  eqCategory,
  async (data) => { categoryDB.put(data); }
);

const tmcDB = dbWrapper(C.TABLE.tmc.name, adapters.tmcAdapter);

export const addTMCHandler = handlerFactory(
  tmcDB,
  eq,
  async (data) => { tmcDB.set(data); }
);

export const changeTMCHandler = handlerFactory(
  tmcDB,
  eq,
  async (data) => { tmcDB.put(data); }
);

const processCardsDB = dbWrapper(C.TABLE.processCards.name, adapters.processCardsAdapter);

export const addPCHandler = handlerFactory(
  processCardsDB,
  eq,
  async (data) => { processCardsDB.set(data); }
);

export const changePCHandler = handlerFactory(
  processCardsDB,
  eq,
  async (data) => { processCardsDB.put(data); }
);
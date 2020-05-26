import eq from 'deep-equal';
import CDB from 'db';
import * as C from 'db/constants';
import { Adapter, IDB } from 'lib/idbx';
import * as adapters from 'domain/dictionary/adapters';
import {
  PriceItem,
  CategoryItem,
  TMCItem,
  ProcessCardItem,
  GroupArticles,
  ServiceItem,
  ExpenseItem,
  ExpenseProduct,
  ExpenseService,
} from 'domain/dictionary/Types';

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
  set: (data: T) => Promise<void>,
  put: (data: T) => Promise<void>,
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

function eqTMC(fbArticle: TMCItem, dba: TMCItem) {
  return eq({
    update: undefined,
    description: undefined,
    ...fbArticle
  }, dba);
}

function eqPC(fbPC: ProcessCardItem, dbPC: ProcessCardItem) {
  return eq({
    update: undefined,
    articles: [],
    ...fbPC,
  }, dbPC);
}

function dbWrapper<T, F>(table: string, adapter: Adapter<T>): DBWrapper<T, F> {
  const dbx = (): IDB => new CDB();
  return {
    get: (key: string) => dbx().getItem(table, adapter, key),
    set: (data) => dbx().addItem(table, data),
    put: (data) => dbx().updateItem(table, data),
  };
}

function handlerFactory<I, F>(
  dbw: DBWrapper<I, F>,
  equal: (f: F, i: I) => boolean,
  action: {
   add(this: DBWrapper<I, F>, f: F): void,
   update(this: DBWrapper<I, F>, f: F): void,
  }
) {
  return async(s: firebase.database.DataSnapshot) => {
    try {
      if (typeof s.key === 'string') {
        const data = s.val();
        const p = await dbw.get(s.key);
        if (p === null) {
          action.add.call(dbw, data);
        } else if (!equal(data, p)) {
          action.update.call(dbw, data);
        }
      }
    } catch (err) {
      console.warn(err, dbw, s.key);
    }
  }
}

function priceFBtoiDB({ expiry, add, ...data}: FBPriceItem): PriceItem {
  return {
    ...data,
    add: new Date(add),
    expiry: expiry ? new Date(expiry) : null,
  }
}

export const priceHandler = handlerFactory(
  dbWrapper(C.TABLE.price.name, adapters.priceAdapter),
  eqPrice,
  {
    async add(data) { await this.set(priceFBtoiDB(data)); },
    async update(data) { await this.put(priceFBtoiDB(data)); },
  }
);

export const categoryHandler = handlerFactory(
  dbWrapper(C.TABLE.category.name, adapters.categoryAdapter),
  eqCategory,
  {
    async add(data) { await this.set(data); },
    async update(data) { await this.put(data); },
  }
);

export const tmcHandler = handlerFactory(
  dbWrapper(C.TABLE.tmc.name, adapters.tmcAdapter),
  eqTMC,
  {
    async add(data) { await this.set(data); },
    async update(data) { await this.put(data); },
  }
);

export const pcHandler = handlerFactory(
  dbWrapper(C.TABLE.processCards.name, adapters.processCardsAdapter),
  eqPC,
  {
    async add(data) { await this.set(data); },
    async update(data) { await this.put(data); },
  }
);

export const groupHandler = handlerFactory(
  dbWrapper(C.TABLE.groupArticles.name, adapters.groupArticlesAdapter),
  eq,
  {
    async add(data: GroupArticles) { await this.set(data); },
    async update(data: GroupArticles) { await this.put(data); },
  }
);

type ExpenseFB = Omit<ExpenseProduct, 'date'> & { date: string } | Omit<ExpenseService, 'date'> & { date: string };

function expenseFbToiDB({ date, ...rest }: ExpenseFB): ExpenseItem {
  return {
    ...rest,
    date: new Date(date),
  }
}

function eqExpense(fb: ExpenseFB, { date, ...rest }: ExpenseItem): boolean {
  return eq(
    fb,
    {
      ...rest,
      date: date.toISOString(),
    }
  )
}

export const expensesHandler = handlerFactory(
  dbWrapper(C.TABLE.expenses.name, adapters.expenses),
  eqExpense,
  {
    async add(data: ExpenseFB) { await this.set(expenseFbToiDB(data)); },
    async update(data: ExpenseFB) { await this.put(expenseFbToiDB(data)); },
  }
);

export const servicesHandler = handlerFactory(
  dbWrapper(C.TABLE.services.name, adapters.services),
  eq,
  {
    async add(data: ServiceItem) { await this.set(data); },
    async update(data: ServiceItem) { await this.put(data); },
  }
);

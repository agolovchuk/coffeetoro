import firebase from 'firebase/app';
import eq from 'deep-equal';
import CDB from 'db';
import * as C from 'db/constants';
import { Validator, IDB } from 'lib/idbx';
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
  IAccountItem,
  EArticlesType,
} from 'domain/dictionary/Types';
import { dayParamsValidator } from 'domain/daily/adapters';
import { DayItem } from 'domain/daily/Types';
import { ITransactionItem, transactionValidator } from 'domain/transaction';

interface PriceContainer {
  id: string,
  add: string;
  expiry?: string;
  parentId: string;
  valuation: number;
  sortIndex: number;
  step: number | undefined;
  quantity: number | undefined;
}

type FBPriceItem = PriceContainer & {
  type: EArticlesType.ARTICLES;
  barcode: string;
} | PriceContainer & {
  type: EArticlesType.PC;
  refId: string;
};

type FBCategory = Omit<CategoryItem, 'count'>;

interface DBWrapper<T> {
  get: (key: string) => Promise<T | null>,
  set: (data: T) => Promise<unknown>,
  put: (data: T) => Promise<unknown>,
}

export function eqPrice(fBPrice: FBPriceItem, { add, expiry, ...dbp }: PriceItem) {
  return eq({
    ...dbp,
    add: add.toISOString(),
    expiry: expiry ? expiry.toISOString() : undefined,
  }, fBPrice);
}

type TDateString<T extends { date: Date}> = Omit<T, 'date'> & { date: string };

function compactObject(o: Record<string, any>) {
  return Object
    .entries(o)
    .reduce((a, [key, value]) => typeof value === 'undefined' ? a : {...a, [key]: value }, {});
}

function eqDateString<T extends { date: Date }>(fbd: TDateString<T>, { date, ...rest }: T): boolean {
  return eq({ ...rest, date: date.toISOString() }, fbd);
}

function dateStringToDate<T extends { date: Date }>({ date, ...rest }: TDateString<T>) {
  return { ...rest, date: new Date(date) };
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

function dbWrapper<T>(table: string, validator: Validator<T>): DBWrapper<T> {
  const dbx = (): IDB => new CDB();
  return {
    get: (key: string) => dbx().getItem(table, validator, key),
    set: (data) => dbx().updateIfExist(table, data),
    put: (data) => dbx().updateItem(table, data),
  };
}

function handlerFactory<I, F>(
  dbw: DBWrapper<I>,
  equal: (f: F, i: I) => boolean,
  action: {
   add(this: DBWrapper<I>, f: F): void,
   update(this: DBWrapper<I>, f: F): void,
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

export const priceHandler = handlerFactory<PriceItem, FBPriceItem>(
  // @ts-ignore
  dbWrapper(C.TABLE.price.name, adapters.priceAdapter), // TODO: You must solve trouble with enum
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
      ...compactObject(rest),
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

export const accountHandler = handlerFactory(
  dbWrapper(C.TABLE.account.name, adapters.account),
  eq,
  {
    async add(data: IAccountItem) { await this.set(data); },
    async update(data: IAccountItem) { await this.put(data); },
  }
);

export const dailyHandler = handlerFactory<DayItem, TDateString<DayItem>>(
  dbWrapper(C.TABLE.daily.name, dayParamsValidator),
  eqDateString,
  {
    async add(data) { await this.set(dateStringToDate(data)); },
    async update(data) { await this.put(dateStringToDate(data)); },
  }
);

export const transactionHandler = handlerFactory<ITransactionItem, TDateString<ITransactionItem>>(
  dbWrapper(C.TABLE.transactionLog.name, transactionValidator),
  eqDateString,
  {
    async add(data) { await this.set(dateStringToDate(data)); },
    async update(data) { await this.put(dateStringToDate(data)); },
  }
)

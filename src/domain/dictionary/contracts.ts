import * as t from 'io-ts';
import { date } from 'io-ts-types/lib/date';
import omit from 'lodash/omit';

export const unit = t.interface({
  id: t.string,
  name: t.string,
  title: t.string,
  type: t.union([t.literal('weight'), t.literal('countable')]),
  sortIndex: t.number,
});

const priceContainer = {
  id: t.string,
  parentId: t.string,
  add: date,
  expiry: t.union([date, t.null, t.undefined]),
  valuation: t.number,
  sortIndex: t.number,
}

export const price = t.union([
  t.interface({
    ...priceContainer,
    type: t.literal('tmc'),
    barcode: t.string,
  }),
  t.interface({
    ...priceContainer,
    type: t.literal('pc'),
    refId: t.string,
  }),
]);

export const category = t.interface({
  id: t.string,
  name: t.string,
  title: t.string,
  sortIndex: t.number,
  parentId: t.string,
  group: t.union([t.undefined, t.string]),
});

export const tmc = t.interface({
  id: t.string,
  parentId: t.string,
  title: t.string,
  description: t.union([t.string, t.undefined]),
  barcode: t.union([t.string, t.undefined]),
  unitId: t.string,
  add: t.string,
  update: t.union([t.string, t.null, t.undefined]),
  boxing: t.union([t.number, t.undefined]),
});

export const processCardsArticle = t.interface({
  id: t.string,
  quantity: t.number,
});

export const pc = t.interface({
  id: t.string,
  parentId: t.string,
  title: t.string,
  description: t.string,
  add: t.string,
  primeCost: t.union([t.number, t.undefined]),
  prescription: t.union([t.string, t.undefined]),
  update: t.union([t.string, t.null, t.undefined]),
  articles: t.union([t.array(processCardsArticle), t.undefined]),
});

export const groupArticles = t.interface({
  id: t.string,
  title: t.string,
  description: t.union([t.string, t.undefined]),
  articles: t.union([t.array(t.string), t.undefined]),
});

export enum MoneySource {
  CASH = 'cash',
  BANK = 'bank',
  INCOME = 'income',
}

export enum SheetType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum DocumentType {
  PRODUCT = 'product',
  SERVICE = 'service',
  REMITTANCE = 'remittance',
}

export const expenseBase = {
  id: t.string,
  docId: t.union([t.string, t.undefined]),
  foreignId: t.union([t.string, t.undefined]),
  valuation: t.number,
  date: date,
  createBy: t.union([t.string, t.undefined]),
  source: t.union([t.literal(MoneySource.CASH), t.literal(MoneySource.BANK), t.literal(MoneySource.INCOME)]),
  about: t.union([t.string, t.undefined]),
}

export const expense = t.union([
  t.interface({
    ...expenseBase,
    type: t.literal(DocumentType.PRODUCT),
    quantity: t.number,
    barcode: t.string,
  }),
  t.interface({
    ...expenseBase,
    type: t.literal(DocumentType.SERVICE),
    refId: t.string,
  }),
  t.interface({
    ...omit(expenseBase, 'foreignId'),
    type: t.literal(DocumentType.REMITTANCE),
  }),
]);

export const service = t.interface({
  id: t.string,
  title: t.string,
  description: t.union([t.string, t.undefined]),
  parentId: t.string,
});

export const documents = t.interface({
  id: t.string,
  date: date,
  createBy: t.string,
  type: t.union([t.literal(SheetType.EXPENSE), t.literal(SheetType.INCOME)]),
  account: t.union([t.literal(SheetType.INCOME), t.literal(SheetType.EXPENSE)]),
  about: t.union([t.string, t.undefined]),
});

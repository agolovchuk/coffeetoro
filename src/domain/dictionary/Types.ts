import * as t from 'io-ts';
import * as contracts from './contracts';

export type CategoryItem = t.TypeOf<typeof contracts.category>;
export type UnitItem = t.TypeOf<typeof contracts.unit>;
export type TMCItem = t.TypeOf<typeof contracts.tmc>;
export type ProcessCardItem = t.TypeOf<typeof contracts.pc>;
export type ProcessCardArticle = t.TypeOf<typeof contracts.processCardsArticle>;
export type GroupArticles = t.TypeOf<typeof contracts.groupArticles>;
export type ExpenseItem = t.TypeOf<typeof contracts.expense>;
export type ServiceItem = t.TypeOf<typeof contracts.service>;

export interface CountedCategoryItem extends CategoryItem {
  count: number;
}
/** ++++++++++++++++*/
export type PriceItem = t.TypeOf<typeof contracts.price>;

export type PriceBase = Omit<PriceItem, 'type' | 'barcode' | 'refId'>;

export interface PriceExtendedBase extends PriceBase {
  title: string;
  description?: string;
  unitId: string;
}

export interface PriceTMC extends PriceBase {
  type: 'tmc';
  barcode: string;
}

export interface PricePC extends PriceBase {
  type: 'pc';
  refId: string;
}
/** ++++++++++++++++*/
const baseContract = t.interface(contracts.expenseBase);
interface ExpenseExtendedBase {
  title: string;
  description?: string;
}
type ExpenseBase = t.TypeOf<typeof baseContract>;
export interface ExpenseProduct extends ExpenseBase {
  type: 'product';
  barcode: string;
  quantity: number;
}
export interface ExpenseService extends ExpenseBase {
  type: 'service';
  refId: string;
}

export type ExpenseExtended = ExpenseExtendedBase & ExpenseProduct | ExpenseExtendedBase & ExpenseService;
/** ++++++++++++++++*/

export type PriceExtended = PriceExtendedBase & PriceTMC | PriceExtendedBase & PricePC;

export interface SaleParams {
  readonly price: PriceExtended;
  readonly volume: string;
}

export interface ProductForSale {
  readonly title: string;
  readonly name: string;
  readonly valuation: ReadonlyArray<SaleParams>;
}

export type Categories = Record<string, CountedCategoryItem>;
export type Units = Record<string, UnitItem>;
export type Prices = Record<string, PriceItem>;
export type TMC = Record<string, TMCItem>;
export type ProcessCards = Record<string, ProcessCardItem>;
export type Groups = Record<string, GroupArticles>;
export type Expenses = Record<string, ExpenseItem>;
export type Services = Record<string, ServiceItem>;

export interface DictionaryState {
  categories: Categories;
  units: Units;
  prices: Prices;
  tmc: TMC;
  processCards: ProcessCards;
  groupArticles: Groups;
  expenses: Expenses;
  services: Services;
};

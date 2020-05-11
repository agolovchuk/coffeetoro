import { TypeOf } from 'io-ts';
import * as contracts from './contracts';

export type CategoryItem = TypeOf<typeof contracts.category>;
export type UnitItem = TypeOf<typeof contracts.unit>;
export type TMCItem = TypeOf<typeof contracts.tmc>;
export type ProcessCardItem = TypeOf<typeof contracts.pc>;
export type ProcessCardArticle = TypeOf<typeof contracts.processCardsArticle>;
export type GroupArticles = TypeOf<typeof contracts.groupArticles>;

export interface CountedCategoryItem extends CategoryItem {
  count: number;
};

export type PriceItem = TypeOf<typeof contracts.price>;

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

export interface DictionaryState {
  categories: Categories;
  units: Units;
  prices: Prices;
  tmc: TMC;
  processCards: ProcessCards;
  groupArticles: Groups;
};

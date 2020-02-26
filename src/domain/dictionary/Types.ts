import { TypeOf } from 'io-ts';
import * as contracts from './contracts';

export type CategoryItem = TypeOf<typeof contracts.category>;

export type ProductItem = TypeOf<typeof contracts.product>;

export type UnitItem = TypeOf<typeof contracts.unit>;

export interface VolumeItem {
  readonly id: string;
  readonly title: string;
  readonly name: string;
}

export type PriceItem = TypeOf<typeof contracts.price>;

export interface SaleParams {
  readonly price: PriceItem;
  readonly volume: string;
}

export interface ProductForSale {
  readonly id: string;
  readonly title: string;
  readonly name: string;
  readonly valuation: ReadonlyArray<SaleParams>;
}

export type Categories = Record<string, CategoryItem>;
export type Products = Record<string, ProductItem>;
export type Units = Record<string, UnitItem>;
export type Prices = Record<string, PriceItem>;

export interface DictionaryState {
  categories: Categories;
  products: Products; 
  units: Units;
  prices: Prices;
};




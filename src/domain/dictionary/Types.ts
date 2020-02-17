

interface CategoryItem {
  id: string;
  title: string;
  name: string;
  parentName: string | null;
  sortIndex: number,
  productsNest: boolean,
}

export interface ProductItem {
  id: string;
  title: string;
  name: string;
  categoryName: string;
}

type UnitType = 'wight' | 'countable';

export interface IUnits {
  id: string;
  title: string;
  name: string;
  type: UnitType
}

export interface VolumeItem {
  readonly id: string;
  readonly title: string;
  readonly name: string;
}

export interface PriceItem {
  id: string;
  productName: string;
  volumeId: string;
  valuation: number;
  from: string;
  to: string | null;
}

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

export type Categories = ReadonlyArray<CategoryItem>;
export type Products = ReadonlyArray<ProductItem>;
export type Volume = Record<string, VolumeItem>;
export type Prices = ReadonlyArray<PriceItem>;

export interface DictionaryState {
  categories: Categories;
  products: Products; 
  volume: Volume;
  prices: Prices;
};




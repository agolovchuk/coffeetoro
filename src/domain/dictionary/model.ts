import {
  Categories,
  Products,
  Units,
  Prices,
  CategoryItem,
  ProductItem,
  PriceItem,
  UnitItem,
} from './Types';
import { createReducer } from '@reduxjs/toolkit';
import * as A from './actions';

export const reducer = {
  categories: createReducer({} as Categories, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<CategoryItem, 'name'>('categories', 'name'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('categories'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<CategoryItem, 'name'>('categories', 'name'),
  }),

  products: createReducer({} as Products, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<ProductItem, 'name'>('products', 'name'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('products'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<ProductItem, 'name'>('products', 'name'),
  }),

  units: createReducer({} as Units, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<UnitItem, 'id'>('units', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('units'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<UnitItem, 'id'>('units', 'id'),
  }),

  prices: createReducer({} as Prices, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<PriceItem, 'id'>('prices', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('prices'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<PriceItem, 'id'>('prices', 'id'),
  }),

};

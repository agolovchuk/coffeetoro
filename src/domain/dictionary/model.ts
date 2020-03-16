import set from 'lodash/fp/set';
import {
  Categories,
  Units,
  Prices,
  UnitItem,
} from './Types';
import { createReducer } from '@reduxjs/toolkit';
import * as A from './actions';

export const reducer = {
  categories: createReducer({} as Categories, {
    [A.CREATE_CATEGORY]: (state, action: A.CreateCategory) => set(action.payload.name)(action.payload)(state),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('categories'),
    [A.UPDATE_CATEGORY]: (state, action: A.UpdateCategory) => set(action.payload.name)(action.payload)(state),
    [A.GET_CATEGORIES_SUCCESS]: (state, action: A.GetCategoriesSuccess) => ({...state, ...action.payload }),
    [A.GET_PRICES_SUCCESS]: (state, action: A.GetPricesSuccess) => ({ ...state, ...action.payload.category })
  }),

  units: createReducer({} as Units, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<UnitItem, 'id'>('units', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('units'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<UnitItem, 'id'>('units', 'id'),
  }),

  prices: createReducer({} as Prices, {
    [A.CREATE_PRICE]: (state, action: A.CreatePrice) => set(action.payload.id)(action.payload)(state),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('prices'),
    [A.UPDATE_PRICE]: (state, action: A.UpdatePrice) => set(action.payload.id)(action.payload)(state),
    [A.GET_PRICES_SUCCESS]: (state, action: A.GetPricesSuccess) => ({ ...state, ...action.payload.prices })
  }),

};

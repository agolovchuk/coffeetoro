import { createReducer } from '@reduxjs/toolkit';
import set from 'lodash/fp/set';
import {
  Categories,
  Units,
  Prices,
  UnitItem,
  TMC,
  TMCItem,
  ProcessCardItem,
  ProcessCards,
  GroupArticles,
  Groups,
  Expenses,
  ExpenseItem,
  Services,
  ServiceItem,
} from './Types';
import * as A from './actions';
import * as ReportAction from '../reports/actions';

export const reducer = {
  categories: createReducer({} as Categories, {
    [A.CREATE_CATEGORY]: (state, action: A.CreateCategory) => set(action.payload.id)(action.payload)(state),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('categories'),
    [A.UPDATE_CATEGORY]: (state, action: A.UpdateCategory) => set(action.payload.id)(action.payload)(state),
    [A.GET_CATEGORIES_SUCCESS]: (state, action: A.GetCategoriesSuccess) => (action.payload),
    [A.GET_CATEGORY]: (state, action: A.GetCategory) => set(action.payload.id)(action.payload)(state),
    // [A.GET_PRICES_SUCCESS]: (state, action: A.GetPricesSuccess) => ({ ...state, ...action.payload.category })
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
    [A.GET_PRICES_SUCCESS]: (state, action: A.GetPricesSuccess) => ({ ...state, ...action.payload.prices }),
    [ReportAction.ADD_ORDER_ITEM_SUCCESS]: (state, action: ReportAction.AddOrderItem) => ({ ...state, ...action.payload.prices }),
    [ReportAction.GET_ORDERS_SUCCESS]: (state, action: ReportAction.GetOrderSuccess) => ({ ...state, ...action.payload.prices }),
  }),

  tmc: createReducer({} as TMC, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<TMCItem, 'id'>('tmc', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('tmc'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<TMCItem, 'id'>('tmc', 'id'),
    [A.GET_PRICES_SUCCESS]: (state, action: A.GetPricesSuccess) => ({ ...state, ...action.payload.articles }),
    [A.GET_PROCESS_CARD]: (state, action: A.GetProcessCard) => ({...state, ...action.payload.articles }),
    [A.GRT_GROUP_ARTICLES]: (state, action: A.GetGroupArticles) => ({ ...state, ...action.payload.articles }),
    [A.PUT_ARTICLES]: (state, action: A.PutArticles) => ({ ...state, ...action.payload }),
    [ReportAction.ADD_ORDER_ITEM_SUCCESS]: (state, action: ReportAction.AddOrderItem) => ({ ...state, ...action.payload.articles}),
    [ReportAction.GET_ORDERS_SUCCESS]: (state, action: ReportAction.GetOrderSuccess) => ({ ...state, ...action.payload.articles}),
    [A.GET_EXPENSE]: (state, action: A.GetExpense) => ({ ...state, ...action.payload.articles }),
  }),

  processCards: createReducer({} as ProcessCards, {
    [A.GET_PROCESS_CARD]: (state, action: A.GetProcessCard) => ({ ...state, [action.payload.processCard.id]: action.payload.processCard }),
    [A.CRUD.createItemAction.type]: A.CRUD.creat<ProcessCardItem, 'id'>('processCards', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('processCards'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<ProcessCardItem, 'id'>('processCards', 'id'),
    [A.GET_PRICES_SUCCESS]: (state, action: A.GetPricesSuccess) => ({ ...state, ...action.payload.processCards }),
    [ReportAction.ADD_ORDER_ITEM_SUCCESS]: (state, action: ReportAction.AddOrderItem) => ({ ...state, ...action.payload.processCards}),
    [ReportAction.GET_ORDERS_SUCCESS]: (state, action: ReportAction.GetOrderSuccess) => ({ ...state, ...action.payload.processCards}),
  }),

  groupArticles: createReducer({} as Groups, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<GroupArticles, 'id'>('groupArticles', 'id'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<GroupArticles, 'id'>('groupArticles', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('groupArticles'),
    [A.GRT_GROUP_ARTICLES]: (state, action: A.GetGroupArticles) => ({ ...state, [action.payload.groupArticles.id]: action.payload.groupArticles }),
  }),

  expenses: createReducer({} as Expenses, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<ExpenseItem, 'id'>('expenses', 'id'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<ExpenseItem, 'id'>('expenses', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('expenses'),
    [A.GET_EXPENSE]: (state, action: A.GetExpense) => action.payload.expenses,
  }),

  services: createReducer({} as Services, {
    [A.CRUD.createItemAction.type]: A.CRUD.creat<ServiceItem, 'id'>('services', 'id'),
    [A.CRUD.updateItemAction.type]: A.CRUD.creat<ServiceItem, 'id'>('services', 'id'),
    [A.CRUD.getAllActionSuccess.type]: A.CRUD.getAll<any>('services'),
    [A.GET_EXPENSE]: (state, action: A.GetExpense) => ({ ...state, ...action.payload.services }),
  }),

};

import { createReducer } from "@reduxjs/toolkit";
import { TRANSACTION_LOG } from './constants';
import { ITransactionItem, ITransactions } from "./Types";
import * as CRUD from "modules/crud";

export const reducer = {
  [TRANSACTION_LOG]: createReducer({} as ITransactions, {
    [CRUD.createItemAction.type]: CRUD.creat<ITransactionItem, 'id'>(TRANSACTION_LOG, 'id'),
    [CRUD.updateItemAction.type]: CRUD.creat<ITransactionItem, 'id'>(TRANSACTION_LOG, 'id'),
    [CRUD.getAllActionSuccess.type]: CRUD.getAll<any>(TRANSACTION_LOG),
  }),
}

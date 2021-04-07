import * as t from 'io-ts';
import * as contracts from './contracts';
import { ADD_TRANSACTION } from './constants';

export type ITransactionItem = t.TypeOf<typeof contracts.transactionItem>;

export type TTransactionItem = Omit<ITransactionItem, 'id'>;

export interface IAddTransaction {
  type: typeof ADD_TRANSACTION;
  payload: ITransactionItem;
}

export interface IWarehouse {
  id: string;
  transaction: string;
  date: Date;
  article: string;
  expense: number;
  income: number;
  balance: number;
}

export interface ICredit {
  credit: number;
}

export type ITransactions = Record<string, ITransactionItem>;

export type Action = IAddTransaction;

export interface ITransactionState {
  transactionLog: ITransactions;
}

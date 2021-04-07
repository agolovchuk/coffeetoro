import { DictionaryState } from "domain/dictionary";
import { ITransactionState } from "domain/transaction";
import { Query } from "lib/idbx";

export type DKeys = keyof DictionaryState | keyof ITransactionState;

export interface Action<T> {
  payload: {
    data: T,
    name: DKeys
  }
}

export interface QueyAction {
  payload: {
    name: DKeys,
    query?: Query | null,
    index?: string
  }
}

type R<S, A> = (state: S, action: A) => S;

export type Reducer<T> = R<Record<string, T>, Action<T>>;

export type PrepareAction<T = Record<string, any>> = (name: DKeys, data: T) => Action<T>;

export type QueryAction = (name: DKeys, query?: Query | null, index?: string) => QueyAction;

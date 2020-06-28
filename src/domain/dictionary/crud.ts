import { createAction } from '@reduxjs/toolkit';
import { Query } from 'lib/idbx/Types';
import { DictionaryState } from './Types';

const CREATE_ITEM = 'CRUD/CREATE';
const GET_ALL = 'CRUD/GET_ALL';
const GET_ALL_SUCCESS = 'CRUD/GET_ALL_SUCCESS';
const UPDATE_ITEM = 'CRUD/UPDATE_ITEM';

type DKeys = keyof DictionaryState;

export interface Action<T> {
  payload: {
    data: T,
    name: DKeys
  }
}

interface QueyAction {
  payload: {
    name: DKeys,
    query?: Query | null,
    index?: string
  }
}

type R<S, A> = (state: S, action: A) => S;

type Reducer<T> = R<Record<string, T>, Action<T>>;

type PrepareAction<T = Record<string, any>> = (name: DKeys, data: T) => Action<T>;

type QueryAction = (name: DKeys, query?: Query | null, index?: string) => QueyAction;

function queryAction(name: DKeys, query?: Query | null, index?: string): QueyAction {
  return {
    payload: { name, query, index },
  }
}

function prepareAction<T>(name: DKeys, data: T): Action<T> {
  return {
    payload: {
      data,
      name,
    }
  }
}

function actionWrapper<T>(name: DKeys, fn: Reducer<T>): Reducer<T> {
  return (state, action) => {
    if (action.payload.name === name) {
      return fn(state, action);
    }
    return state;
  }
}

type Effect<T> = (d: T) => void | Promise<void>;

export function effect<T>(name: DKeys, action: Action<T>, fn: Effect<T>) {
  if (action.payload.name === name) {
    fn(action.payload.data);
  }
}

export function creat<T extends Record<K, any>, K extends keyof T>(name: DKeys, field: keyof T): Reducer<T> {
  return actionWrapper(
    name,
    (state, action) => ({
      ...state,
      [action.payload.data[field]]: action.payload.data
    }),
  );
}

export function getAll<T extends Record<string, T>>(name: DKeys): Reducer<T> {
  return actionWrapper(
    name,
    (_, action) => action.payload.data,
  )
}

export function mergeAll<T extends Record<string, T>>(name: DKeys): Reducer<T> {
  return actionWrapper(
    name,
    (state, action) => ({
      ...state,
      ...action.payload.data,
    })
  )
}

export const createItemAction = createAction<PrepareAction, typeof CREATE_ITEM>(CREATE_ITEM, prepareAction);
export const getAllAction = createAction<QueryAction, typeof GET_ALL>(GET_ALL, queryAction);
export const getAllActionSuccess = createAction<PrepareAction, typeof GET_ALL_SUCCESS>(GET_ALL_SUCCESS, prepareAction);
export const updateItemAction = createAction<PrepareAction, typeof UPDATE_ITEM>(UPDATE_ITEM, prepareAction);

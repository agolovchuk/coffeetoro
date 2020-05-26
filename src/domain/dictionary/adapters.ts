import * as t from 'io-ts';
import * as contracts from './contracts';
import { dictionaryAdapterFactory, valueOrThrow } from 'lib/contracts';
import { arrayToRecord } from 'lib/dataHelper';
import {PriceItem, TMCItem, ProcessCardItem, ExpenseItem, ServiceItem} from './Types';

function validate<A, O, I>(contract: t.Type<A, O, I>, v: I): A | null {
  try {
    return valueOrThrow(contract, v)
  } catch (err) {
    return null;
  }
}

export const categories = dictionaryAdapterFactory(contracts.category, 'id');
export const prices = dictionaryAdapterFactory(contracts.price, 'id');
export const priceAdapter = (v: unknown) => validate(contracts.price, v);
export const categoryAdapter = (v: unknown) => validate(contracts.category, v);
export const unitAdapter = (v: unknown) => validate(contracts.unit, v);
export const tmcAdapter = (v: unknown) => validate(contracts.tmc, v);
export const processCardsAdapter = (v: unknown) => validate(contracts.pc, v);
export const groupArticlesAdapter = (v: unknown) => validate(contracts.groupArticles, v);
export const pricesToDictionary = (arr: PriceItem[]) => arrayToRecord(arr, 'id');
export const articlesToDictionary = (arr: ReadonlyArray<TMCItem>) => arrayToRecord(arr, 'id');
export const pcToDictionary = (arr: ProcessCardItem[]) => arrayToRecord(arr, 'id');
export const expenses = (v: unknown) => validate(contracts.expense, v);
export const services = (v: unknown) => validate(contracts.service, v);
export const expensesToDictionary = (arr: ExpenseItem[]) => arrayToRecord(arr, 'id');
export const servicesToDictionary = (arr: ServiceItem[]) => arrayToRecord(arr, 'id');

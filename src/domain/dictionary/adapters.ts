import * as t from 'io-ts';
import * as contracts from './contracts';
import { dictionaryAdapterFactory, valueOrThrow } from 'lib/contracts';

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
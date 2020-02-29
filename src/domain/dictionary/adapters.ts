import * as contracts from './contracts';
import { dictionaryAdapterFactory } from 'lib/contracts';

export const categories = dictionaryAdapterFactory(contracts.category, 'name');
export const prices = dictionaryAdapterFactory(contracts.price, 'id');
import { TypeOf } from 'io-ts';
import * as orderContracts from 'domain/orders/contracts';
import { valueOrThrow } from 'lib/contracts';
import * as dictionaryContracts from 'domain/dictionary/contracts';
import { dictionaryAdapterFactory } from './helpers';

export const orderAdapter = dictionaryAdapterFactory(orderContracts.order, 'id');
export const orderItemAdapter = dictionaryAdapterFactory(orderContracts.orderItem, 'priceId');

export function oneOrderAdapter(value: unknown): TypeOf<typeof orderContracts.order> | null  {
  try {
    return valueOrThrow(orderContracts.order, value);
  } catch (err) {
    return null;
  }
}

export const dictionaryAdapters = {
  prices: dictionaryAdapterFactory(dictionaryContracts.price, 'id'),
  units: dictionaryAdapterFactory(dictionaryContracts.unit, 'id'),
  categories: dictionaryAdapterFactory(dictionaryContracts.category, 'name'),
  products: dictionaryAdapterFactory(dictionaryContracts.product, 'name'),
};

import { TypeOf } from 'io-ts';
import * as orderContracts from 'domain/orders/contracts';
import { valueOrThrow, dictionaryAdapterFactory } from 'lib/contracts';
import * as dictionaryContracts from 'domain/dictionary/contracts';
import * as adapters from 'domain/dictionary/adapters'

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
  tmc: dictionaryAdapterFactory(dictionaryContracts.tmc, 'id'),
  processCards: dictionaryAdapterFactory(dictionaryContracts.pc, 'id'),
  categories: adapters.categories,
};

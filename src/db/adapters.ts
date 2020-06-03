import { dictionaryAdapterFactory } from 'lib/contracts';
import * as dictionaryContracts from 'domain/dictionary/contracts';
import * as adapters from 'domain/dictionary/adapters'

export const dictionaryAdapters = {
  prices: dictionaryAdapterFactory(dictionaryContracts.price, 'id'),
  units: dictionaryAdapterFactory(dictionaryContracts.unit, 'id'),
  tmc: dictionaryAdapterFactory(dictionaryContracts.tmc, 'id'),
  processCards: dictionaryAdapterFactory(dictionaryContracts.pc, 'id'),
  groupArticles: dictionaryAdapterFactory(dictionaryContracts.groupArticles, 'id'),
  categories: adapters.categories,
  expenses: dictionaryAdapterFactory(dictionaryContracts.expense, 'id'),
  services: dictionaryAdapterFactory(dictionaryContracts.service, 'id'),
};

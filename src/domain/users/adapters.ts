import * as contracts from './contracts';
import { valueOrThrow, dictionaryAdapterFactory } from '../../lib/contracts';

export const userAdapters = (value: unknown) => valueOrThrow(contracts.user, value);
export const usersListAdapter = dictionaryAdapterFactory(contracts.user, 'id');

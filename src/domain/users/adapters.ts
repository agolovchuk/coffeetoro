import * as contracts from './contracts';
import { valueOrThrow } from '../../lib/contracts';

export const userAdapters = (value: unknown) => valueOrThrow(contracts.user, value);

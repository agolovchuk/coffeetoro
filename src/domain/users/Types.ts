import { TypeOf } from 'io-ts';
import * as contracts from './contracts';

export type User = TypeOf<typeof contracts.user>;

export interface UsersState {
  users: Record<string, User>
}

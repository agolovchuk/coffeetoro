import { createSelector } from 'reselect';
import { AppState } from '../StoreType';

export function toArray<T>(obj: Record<string, T>): ReadonlyArray<T> {
  return Object.values(obj);
}

const users = (state: AppState) => state.users;

export const usersListSelector = createSelector(users, toArray);

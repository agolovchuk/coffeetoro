import { createSelector } from 'reselect';
import { AppState } from '../StoreType';

const users = (state: AppState) => state.users;

export const usersListSelector = createSelector(users, u => Object.values(u));

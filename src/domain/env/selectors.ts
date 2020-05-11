import { createSelector } from 'reselect';
import { EnvState } from './Types';

const env = (state: EnvState) => state.env;

export const envSelector = createSelector(env, e => e);
export const multiplierSelector = createSelector(envSelector, e => e.multiplier);
export const userSelector = createSelector(envSelector, e => e.user);
export const langSelector = createSelector(userSelector, e => e ? e.lang : 'en');
export const firebaseConfigSelector = createSelector(envSelector, e => e.firebaseConfig);

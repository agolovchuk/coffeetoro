import { createSelector } from 'reselect';
import { EnvState } from './Types';

const env = (state: EnvState) => state.env;

export const multiplierSelector = createSelector(env, e => e.multiplier);
export const userSelector = createSelector(env, e => e.user);
export const langSelector = createSelector(userSelector, e => e ? e.lang : 'en');

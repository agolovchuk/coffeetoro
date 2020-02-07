import { createSelector } from 'reselect';
import { EnvState } from './Types';

const env = (state: EnvState) => state.env;

export const activeOrderSelector = createSelector(env, e => e.activeOrder);
import { createSelector } from 'reselect';
import { EnvState } from './Types';

const env = (state: EnvState) => state.env;

export const multiplierSelector = createSelector(env, e => e.multiplier);
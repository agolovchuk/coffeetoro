import { createSelector } from 'reselect';
import { DailyState } from './Types';

export const daily = (state: DailyState) => state.daily;

export const dailyParamsSelector = createSelector([daily], d => d);

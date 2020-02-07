import { createSelector } from 'reselect';
import { PropsMatch, RouterState } from './Types';

export const params = (state: any, props: PropsMatch) => props.match.params;

const router = (state: RouterState) => state.router;

export const locationSelector = createSelector(router, r => r.location);

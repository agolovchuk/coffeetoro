import { createSelector } from 'reselect';
import { RouterState, Params } from './Types';

interface PropsMatch<T = Params> {
  match: {
    params: T
  }
}

export const params = (state: any, props: PropsMatch) => props.match.params;

const router = (state: RouterState) => state.router;

export const locationSelector = createSelector(router, r => r.location);

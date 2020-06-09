import set from 'lodash/fp/set';
import { DayItem } from './Types';
import * as A from './actions';

export const reducer = {
  daily(state: Record<string, DayItem> = {}, action: A.Action) {
    switch (action.type) {

      case A.SET_DAY_PARAMS:
        return { ...state, ...action.payload };

      case A.GET_DAY_PARAMS:
        return set(action.payload.dateKey)(action.payload)(state);

      default:
        return state;
    }
  }
}

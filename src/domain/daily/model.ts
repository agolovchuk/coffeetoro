import { DayItem } from './Types';
import * as A from './actions';

export const reducer = {
  daily(state: Record<string, DayItem> = {}, action: A.Action) {
    switch (action.type) {

      case A.SET_DAY_PARAMS:
        return state;

      default:
        return state;
    }
  }
}

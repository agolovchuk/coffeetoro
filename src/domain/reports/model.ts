import set from "lodash/fp/set";
import { OrderArchiveItem } from './Types';
import * as A from "./actions";

export const reducer = {
  reports(state: Record<string, OrderArchiveItem> = {}, action: A.Action) {
    switch (action.type) {

      case A.GET_DAILY:
        return {};

      case A.ADD_ORDER_ITEM_SUCCESS:
        return set(action.payload.order.id)(action.payload.order)(state);

      default:
        return state;
    }
  }
}

import { OrderArchiveItem } from './Types';
import * as A from "./actions";
import concat from "lodash/fp/concat";

export const reducer = {
  reports(state: ReadonlyArray<OrderArchiveItem> = [], action: A.Action) {
    switch (action.type) {

      case A.GET_DAILY:
        return [];

      case A.ADD_ORDER_ITEM_SUCCESS:
        return concat(action.payload.order)(state);

      default:
        return state;
    }
  }
}

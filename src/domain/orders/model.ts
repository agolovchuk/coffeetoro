import * as A from './actions';
import compose from 'lodash/fp/compose';
import set from 'lodash/fp/set';
import update from 'lodash/fp/update';
import omit from 'lodash/fp/omit';
import { Order, OrderItem } from './Types';

export const reducer = {
  orderItems(state: Record<string, OrderItem> = {}, action: A.Action) {
    switch (action.type) {
      case A.ADD_ITEM:
        return set(action.payload.priceId)(action.payload)(state);

      case A.UPDATE_QUANTITY:
        return update([action.payload.priceId, 'quantity'])
          (p => action.payload.quantity)
          (state);

      case A.REMOVE_ITEM:
        return omit(action.payload.priceId)(state);

      case A.UPDATE_ITEM:
        return compose(
          omit(action.payload.prevPriceId),
          set(action.payload.nextPriceId)({
            priceId: action.payload.nextPriceId,
            quantity: action.payload.quantity,
          })
        )(state)

      case A.GET_ORDER_ITEMS_SUCCESS:
        return action.payload;

      case A.COMPLETE:
        return {};

      default:
        return state;
    }
  },
  ordersList(state: Record<string, Order> = {}, action: A.Action) {
    switch (action.type) {

      case A.CREATE_ORDER:
        return set(action.payload.id)(action.payload)(state);

      case A.GET_ORDER_SUCCESS:
        return set(action.payload.id)(action.payload)(state);

      case A.GET_ORDERS_LIST_SUCCESS:
        return action.payload;

      case A.COMPLETE:
        return {};

      default:
        return state;
    }
  }
};

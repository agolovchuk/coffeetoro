import * as A from './actions';
import compose from 'lodash/fp/compose';
import set from 'lodash/fp/set';
import update from 'lodash/fp/update';
import omit from 'lodash/fp/omit';
import { Order } from './Types';

export const reducer = {
  ordersList(state: Record<string, Order> = {}, action: A.Action) {
    switch (action.type) {

      case A.CREATE_ORDER:
        return set(action.payload.id)(action.payload)(state);

      case A.ADD_ITEM:
        return set([
          action.payload.orderId,
          'items',
          action.payload.priceId
        ])(omit('orderId')(action.payload))(state);

      case A.UPDATE_QUANTITY:
        return set([
          action.payload.orderId,
          'items',
          action.payload.priceId,
          'quantity'
        ])(action.payload.quantity)(state);

      case A.REMOVE_ITEM:
        return update([action.payload.orderId, 'items'])(omit(action.payload.priceId))(state);

      case A.UPDATE_ITEM:
        return update([action.payload.orderId, 'items'])(
          compose(
            omit(action.payload.prevPriceId),
            set(action.payload.nextPriceId)({
              priceId: action.payload.nextPriceId,
              quantity: action.payload.quantity,
            }),
          ),
        )(state);

      default:
        return state;
    }
  }
};

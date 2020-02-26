import { createReducer } from '@reduxjs/toolkit';
import compose from 'lodash/fp/compose';
import set from 'lodash/fp/set';
import update from 'lodash/fp/update';
import omit from 'lodash/fp/omit';
import { Order, OrderItem, OrderDictionary } from './Types';
import * as A from './actions';

export const reducer = {
  orderItems(state: Record<string, OrderItem> = {}, action: A.Action) {
    switch (action.type) {
      case A.ADD_ITEM:
        return set(action.payload.price.id)(action.payload.item)(state);

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

      case A.getOrderSuccessAction.type:
        return action.payload.orderItems;

      case A.completeOrderAction.type:
        return {};

      default:
        return state;
    }
  },
  ordersList(state: Record<string, Order> = {}, action: A.Action) {
    switch (action.type) {

      case A.CREATE_ORDER:
        return set(action.payload.id)(action.payload)(state);

      case A.getOrderSuccessAction.type:
        return set(action.payload.order.id)(action.payload.order)(state);

      case A.GET_ORDERS_LIST_SUCCESS:
        return action.payload;

      case A.completeOrderAction.type:
        return set([action.payload.id, 'payment'])(action.payload.method)(state);

      default:
        return state;
    }
  },
  orderDictionary: createReducer({ products: {}, prices: {} } as OrderDictionary, {
    [A.getOrderSuccessAction.type]: (_, action: ReturnType<typeof A.getOrderSuccessAction>) => ({
      products: action.payload.products,
      prices: action.payload.prices,
    }),
    [A.ADD_ITEM]: (state, action: A.IAddItem) => 
     compose(
      set(['products', action.payload.product.name])(action.payload.product),
      set(['prices', action.payload.price.id])(action.payload.price)
    )(state),
    [A.completeOrderAction.type]: () => ({ products: {}, prices: {} }),
  }),
};

import { createReducer } from '@reduxjs/toolkit';
import compose from 'lodash/fp/compose';
import set from 'lodash/fp/set';
import update from 'lodash/fp/update';
import omit from 'lodash/fp/omit';
import merge from 'lodash/fp/merge';
import { Order, OrderItem, OrderDictionary, DiscountItem } from './Types';
import * as A from './actions';

export const reducer = {
  orderItems(state: Record<string, OrderItem> = {}, action: A.Action) {
    switch (action.type) {
      case A.ADD_ITEM:
        return set(action.payload.price.id)(action.payload.item)(state);

      case A.UPDATE_QUANTITY:
        return update([action.payload.priceId, 'quantity'])
          (_ => action.payload.quantity)
          (state);

      case A.REMOVE_ITEM:
        return omit(action.payload.priceId)(state);

      case A.GET_ORDER:
        return action.payload.orderItems;

      case A.COMPLETE:
        return {};

      default:
        return state;
    }
  },
  discountItems(state: Record<string, DiscountItem> = {}, action: A.Action) {
    switch (action.type) {
      case A.GET_ORDER:
        return action.payload.discounts;

      case A.ADD_DISCOUNT:
        return set(action.payload.discountId)(action.payload)(state);

      case A.REMOVE_DISCOUNT:
        return omit(action.payload.discountId)(state);

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

      case A.GET_ORDER:
        return set(action.payload.order.id)(action.payload.order)(state);

      case A.GET_ORDERS_LIST:
        return action.payload;

      case A.COMPLETE:
        return set(action.payload.id)(action.payload)(state);

      default:
        return state;
    }
  },
  orderDictionary: createReducer({ prices: {}, articles: {}, processCards: {} } as OrderDictionary, {
    [A.GET_ORDER]: (_, action: A.GetOrder) => ({
      prices: action.payload.prices,
      articles: action.payload.articles,
      processCards: action.payload.processCards,
    }),
    [A.ADD_ITEM]: (state, action: A.IAddItem) =>
     compose(
      update('processCards')(merge(action.payload.processCards)),
      update('articles')(merge(action.payload.articles)),
      set(['prices', action.payload.price.id])(action.payload.price)
    )(state),
    [A.COMPLETE]: () => ({ prices: {}, articles: {}, processCards: {} }),
  }),
};

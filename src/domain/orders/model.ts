import * as A from './actions';
import { mergeOrder, updateOrder, updateOrderItem, removeOrderItem } from './helpers';
import { OrderItem } from './Types';

function order(): Record<string, OrderItem> {
  return {
    "2": {
      "id": "#fff",
      "priceId": "2",
      "quantity": 1
    },
  };
}

type Action = ReturnType<typeof A.addItemAction>
  | ReturnType<typeof A.updateQuantityAction>
  | ReturnType<typeof A.updateItemAction>
  | ReturnType<typeof A.removeItemAction>
  ;

export const reducer = {
  order(state = order(), action: Action) {
    switch (action.type) {

      case A.ADD_ITEM:
        return mergeOrder(state, action.payload);

      case A.UPDATE_QUANTITY:
        return updateOrder(state, action.payload);

      case A.UPDATE_ITEM:
        return updateOrderItem(state, action.payload.prevPriceId, action.payload.nextPriceId);

      case A.REMOVE_ITEM:
        return removeOrderItem(state, action.payload.priceId);

      default:
        return state;
    }
  },
};

import { Dispatch, MiddlewareAPI } from 'redux';
import { replace } from 'connected-react-router';
import * as OrderAction from 'domain/orders/actions';
import IDB from 'lib/idbx/db';
import * as C from './constants';
import requestUpgrade from './migration';
import { orderAdapter, validateOrder, orderItemAdapter } from './helpers';

type Action = OrderAction.Action;

export default function idbMiddlware() {
  const idb = new IDB('cachebox', requestUpgrade);
  return ({ getState, dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    switch (action.type) {
      case OrderAction.CREATE_ORDER:
        idb.addItem(C.TABLE.orders.name, action.payload);
        break;

      case OrderAction.GET_ORDER:
        idb.getItem(C.TABLE.orders.name, action.payload.id, validateOrder)
          .then((order) => {
            if (order) {
              dispatch(OrderAction.getOrderSuccessAction(order));
            } else {
              dispatch(replace('/'));
            }
          })
        break;

      case OrderAction.GET_ORDER_SUCCESS:
        idb.getDictionary(
          C.TABLE.orderItem.name,
          C.TABLE.orderItem.field.orderId,
          action.payload.id,
          orderItemAdapter,
        )
          .then((res) => {
            if (res) dispatch(OrderAction.getOrderItemsSuccessAction(res));
          })
        break;

      case OrderAction.GET_ORDERS_LIST:
        idb.getDictionary(
          C.TABLE.orders.name,
          C.TABLE.orders.field.payment,
          0,
          orderAdapter,
        )
          .then((res) => {
            if (res) dispatch(OrderAction.getOrdersListSuccessAction(res));
          });
        break;

      case OrderAction.ADD_ITEM:
        idb.addItem(C.TABLE.orderItem.name, action.payload);
        break;

      case OrderAction.UPDATE_QUANTITY:
        idb.updateItem(C.TABLE.orderItem.name, action.payload);
        break;

      case OrderAction.REMOVE_ITEM:
        idb.deleteItem(C.TABLE.orderItem.name, [action.payload.orderId, action.payload.priceId]);
        break;
      default:
        break;
    }
    return next(action);
  }
}

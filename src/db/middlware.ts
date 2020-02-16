import { Dispatch, MiddlewareAPI } from 'redux';
import { replace } from 'connected-react-router';
import get from 'lodash/get';
import * as OrderAction from 'domain/orders/actions';
import { PaymentMethod } from 'domain/orders/Types';
import IDB from 'lib/idbx/db';
import * as C from './constants';
import requestUpgrade from './migration';
import { orderAdapter, oneOrderAdapter, orderItemAdapter } from './helpers';

type Action = OrderAction.Action;

export default function idbMiddlware() {
  const idb = new IDB('cachebox', requestUpgrade);
  return ({ getState, dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    switch (action.type) {
      case OrderAction.CREATE_ORDER:
        idb.addItem(C.TABLE.orders.name, action.payload);
        break;

      case OrderAction.GET_ORDER:
        idb.getItem(
          C.TABLE.orders.name,
          C.TABLE.orders.field.orderIdPayment,
          [action.payload.id, PaymentMethod.Opened],
          oneOrderAdapter,
        )
          .then((order) => {
            if (order) {
              dispatch(OrderAction.getOrderSuccessAction(order));
            } else {
              dispatch(replace('/'));
            }
          });
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

      case OrderAction.COMPLETE:
        idb.open().then(db => new Promise((resolve, reject) => {
          const request = db
            .transaction([C.TABLE.orders.name], C.READ_WRITE)
            .objectStore(C.TABLE.orders.name)
            .openCursor(action.payload.id)
          request.onsuccess = function success(event) {
            const cursor = get(event, ['target', 'result']);
            if (cursor) {
              const v = Object.assign({}, cursor.value, { payment: action.payload.method });
              cursor.update(v);
              cursor.continue();
            } else {
              db.close();
              resolve();
            }
          };
          request.onerror = () => { db.close(); reject() }
        }))
          .then(() => { dispatch(replace('/')) });
        break;
      default:
        break;
    }
    return next(action);
  }
}

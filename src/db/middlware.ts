import { Dispatch, MiddlewareAPI } from 'redux';
import { replace } from 'connected-react-router';
import get from 'lodash/get';
import * as OrderAction from 'domain/orders/actions';
import * as DictionaryAction from 'domain/dictionary/actions';
import { OrderItem, Order } from 'domain/orders/Types';
import { Products, ProductItem, PriceItem } from 'domain/dictionary/Types';
import IDB from 'lib/idbx/db';
import * as C from './constants';
import requestUpgrade from './migration';
import * as adapters from './adapters';
import { validateArray } from './helpers';

type Action = OrderAction.Action | DictionaryAction.Action;

function promisifyReques<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = function() {
      resolve(this.result);
    }
    req.onerror = function() {
      reject(this.error);
    }
  });
}

export default function idbMiddlware() {
  const idb = new IDB('cachebox', requestUpgrade);
  return ({ getState, dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    switch (action.type) {
      case OrderAction.CREATE_ORDER:
        idb.addItem(C.TABLE.orders.name, action.payload);
        break;

      case OrderAction.GET_ORDER:
        idb.open().then((db) => {
          const transaction = db.transaction([
            C.TABLE.orders.name,
            C.TABLE.orderItem.name,
            C.TABLE.product.name,
            C.TABLE.price.name,
          ]);
          let order: Order | null = null;
          let orderItems: Record<string, OrderItem>;
          let products: Products;
          let prices: Record<string, PriceItem>;
          transaction.oncomplete = () => {
            db.close();
            if (order !== null) {
              dispatch(
                OrderAction.getOrderSuccessAction({
                  order,
                  orderItems,
                  products,
                  prices
                })
              )
            }
          };
          const ordersRequest = transaction.objectStore(C.TABLE.orders.name).get(action.payload.id);
          const orderRequest = transaction.objectStore(C.TABLE.orderItem.name).index('orderId').getAll(action.payload.id);
          const priceStore = transaction.objectStore(C.TABLE.price.name);
          const productStore = transaction.objectStore(C.TABLE.product.name).index('name');
          promisifyReques<Order>(ordersRequest).then(res => {
            order = adapters.oneOrderAdapter(res);
          })
          promisifyReques<OrderItem[]>(orderRequest)
            .then(res => {
              orderItems = validateArray(adapters.orderItemAdapter)(res);
              return Promise.all(
                res.map(
                  e => promisifyReques<PriceItem>(
                    priceStore.get(e.priceId)
                  )
                )
              );
            })
            .then(res => {
              prices = validateArray(adapters.dictionaryAdapters['prices'])(res);
              const productNames: string[] = res.reduce((a: string[], v) => a.includes(v.productName) ? a : a.concat(v.productName), []);
              return Promise.all(
                productNames.map(e => promisifyReques<ProductItem>(productStore.get(e)))
              )
            })
            .then((res) => {
              products = validateArray(adapters.dictionaryAdapters['products'])(res);
            })
        });
        break;

      case OrderAction.GET_ORDERS_LIST:
        idb.getDictionary(
          C.TABLE.orders.name,
          adapters.orderAdapter,
          C.TABLE.orders.field.payment,
          0,
        )
          .then((res) => {
            if (res) dispatch(OrderAction.getOrdersListSuccessAction(res));
          });
        break;

      case OrderAction.ADD_ITEM:
        idb.addItem(C.TABLE.orderItem.name, action.payload.item);
        break;

      case OrderAction.UPDATE_QUANTITY:
        idb.updateItem(C.TABLE.orderItem.name, action.payload);
        break;

      case OrderAction.REMOVE_ITEM:
        idb.deleteItem(C.TABLE.orderItem.name, [action.payload.orderId, action.payload.priceId]);
        break;

      case OrderAction.completeOrderAction.type:
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

      case DictionaryAction.CRUD.getAllAction.type:
        const { name, index, query } = action.payload;
        const validator = adapters.dictionaryAdapters[name];
        idb.getAll(name, validateArray(validator), index, query).then(res => {
          if (res) dispatch(DictionaryAction.CRUD.getAllActionSuccess(name, res))
        });
        break;

      case DictionaryAction.CRUD.createItemAction.type:
        idb.addItem(action.payload.name, action.payload.data);
        break;
      
      case DictionaryAction.CRUD.updateItemAction.type:
        idb.updateItem(action.payload.name, action.payload.data);
        break;

      default:
        break;
    }
    return next(action);
  }
}

import { Dispatch, MiddlewareAPI } from 'redux';
import { replace } from 'connected-react-router';
import CDB, { promisifyReques } from './index';
import * as OrderAction from 'domain/orders/actions';
import * as DictionaryAction from 'domain/dictionary/actions';
import { OrderItem, Order } from 'domain/orders/Types';
import { PriceItem, CategoryItem } from 'domain/dictionary/Types';
import * as C from './constants';
import * as adapters from './adapters';
import { validateArray } from 'lib/contracts';

type Action = OrderAction.Action | DictionaryAction.Action;

export default function idbMiddlware() {
  const Idb = new CDB();
  return ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    switch (action.type) {
      case OrderAction.CREATE_ORDER:
        Idb.addItem(C.TABLE.orders.name, action.payload);
        break;

      case OrderAction.GET_ORDER:
        Idb.open().then((db) => {
          const transaction = db.transaction([
            C.TABLE.orders.name,
            C.TABLE.orderItem.name,
            C.TABLE.price.name,
            C.TABLE.category.name,
          ]);
          let order: Order | null = null;
          let orderItems: Record<string, OrderItem>;
          let categories: Record<string, CategoryItem>;
          let prices: Record<string, PriceItem>;
          transaction.oncomplete = () => {
            db.close();
            if (order !== null) {
              dispatch(
                OrderAction.getOrderSuccessAction({
                  order,
                  orderItems,
                  prices,
                  categories,
                })
              )
            } else {
              dispatch(replace('/'));
            }
          };
          const ordersRequest = transaction.objectStore(C.TABLE.orders.name).get(action.payload.id);
          const orderRequest = transaction.objectStore(C.TABLE.orderItem.name).index('orderId').getAll(action.payload.id);
          const priceStore = transaction.objectStore(C.TABLE.price.name);
          const categoryStore = transaction.objectStore(C.TABLE.category.name);
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
              const categoryId: string[] = res.reduce((a: string[], v) => a.includes(v.categoryId) ? a : a.concat(v.categoryId), []);
              return Promise.all(
                categoryId.map(e => promisifyReques<CategoryItem>(categoryStore.get(e)))
              )
            })
            .then((res) => {
              categories = validateArray(adapters.dictionaryAdapters['categories'])(res.map(e => ({ ...e, count: 0 })));
            })
        });
        break;

      case OrderAction.GET_ORDERS_LIST:
        Idb.getDictionary(
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
        Idb.addItem(C.TABLE.orderItem.name, action.payload.item);
        break;

      case OrderAction.UPDATE_QUANTITY:
        Idb.updateItem(C.TABLE.orderItem.name, action.payload);
        break;

      case OrderAction.REMOVE_ITEM:
        Idb.deleteItem(C.TABLE.orderItem.name, [action.payload.orderId, action.payload.priceId]);
        break;

      case DictionaryAction.CRUD.getAllAction.type:
        const { name, index, query } = action.payload;
        const validator = adapters.dictionaryAdapters[name];
        Idb.getAll(name, validateArray(validator), index, query).then(res => {
          if (res) dispatch(DictionaryAction.CRUD.getAllActionSuccess(name, res))
        });
        break;

      case DictionaryAction.CRUD.createItemAction.type:
        Idb.addItem(action.payload.name, action.payload.data);
        break;
      
      case DictionaryAction.CRUD.updateItemAction.type:
        Idb.updateItem(action.payload.name, action.payload.data);
        break;

      default:
        break;
    }
    return next(action);
  }
}

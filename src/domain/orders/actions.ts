import get from 'lodash/get';
import CDB from 'db';
import * as C from 'db/constants';
import {getId} from 'lib/id';
import {arrayToRecord} from 'lib/dataHelper';
import {EEventsTag, enrichException} from 'lib/loger';
import {DiscountItem, Order, OrderItem, PaymentMethod} from './Types';
import {
  articlesByBarcodeSelector,
  pcToDictionary,
  PriceItem,
  pricesToDictionary,
  ProcessCardItem,
  TMCItem,
} from 'domain/dictionary';
import { addTransactionAction } from 'domain/transaction';
import { ThunkAction } from '../StoreType';
import * as adapters from './adapters';
import { prepareDictionary } from './helpers';

export const CREATE_ORDER = 'ORDERS/CREATE_ORDER';
export const REMOVE_ORDER = 'ORDERS/REMOVE_ORDER';

export const ADD_ITEM = 'ORDER/ADD_ITEM';
export const UPDATE_QUANTITY = 'ORDER/UPDATE_QUANTITY';
export const REMOVE_ITEM = 'ORDER/REMOVE_ITEM';
export const COMPLETE = 'ORDER/COMPLETE';

export const GET_ORDER = 'ORDER/GET_ORDER';

export const GET_ORDERS_LIST = 'ORDER/GET_ORDERS_LIST';

export const ADD_DISCOUNT = 'ORDER/ADD_DISCOUNT';
export const REMOVE_DISCOUNT = 'ORDER/REMOVE_DISCOUNT';

export interface IAddItem {
  type: typeof ADD_ITEM;
  payload: {
    item: OrderItem;
    price: PriceItem;
    articles: Record<string, TMCItem>;
    processCards: Record<string, ProcessCardItem>;
  }
}

export function fastAddAction(orderId: string, barcode: string): ThunkAction<IAddItem, Promise<boolean>> {
  return async(dispatch, getState) => {
    const { orderItems } = getState();
    try {
      const idb = new CDB();
      const { price, article } = await idb.getPriceByBarcode(barcode);
      if (typeof price === 'undefined' || typeof article === 'undefined') {
        return false
      }
      const item = {
        orderId,
        priceId: price.id,
        quantity: (get(orderItems, [price.id, 'quantity'], 0) + 1),
      };
      dispatch({
        type: ADD_ITEM,
        payload: {
          item,
          price,
          articles: {
            [price.barcode]: article,
          },
          processCards: {},
        }
      });
      await idb.addItem(C.TABLE.orderItem.name, item);
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
}

export function addItemAction(orderId: string, priceId: string): ThunkAction<IAddItem> {
  return async(dispatch, getState) => {
    const { prices, orderItems, processCards } = getState();
    const oi = get(orderItems, priceId)
    const tmc = articlesByBarcodeSelector(getState());
    const price = get(prices, priceId);
    const item = {
      orderId,
      priceId,
      quantity: (oi ? oi.quantity + 1 : 1),
    };
    try {
      const idb = new CDB();
      await idb[oi ? 'updateItem' : 'addItem'](C.TABLE.orderItem.name, item);
      const dict = prepareDictionary(price, tmc, processCards);
      dispatch({
        type: ADD_ITEM,
        payload: {
          item,
          price,
          ...dict,
        }
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

interface UpdateQuantity {
  type: typeof UPDATE_QUANTITY;
  payload: OrderItem;
}

export function updateQuantityAction(orderId: string, priceId: string, quantity: number): ThunkAction<UpdateQuantity> {
  return async(dispatch) => {
    const item = { orderId, priceId, quantity };
    try {
      const idb = new CDB();
      await idb.updateItem(C.TABLE.orderItem.name, item);
      dispatch({
        type: UPDATE_QUANTITY,
        payload: item,
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

interface RemoveItem {
  type: typeof REMOVE_ITEM;
  payload: {
    orderId: string;
    priceId: string;
  };
}

export function removeItemAction(orderId: string, priceId: string): ThunkAction<RemoveItem> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      await idb.deleteItem(C.TABLE.orderItem.name, [orderId, priceId]);
      dispatch({
        type: REMOVE_ITEM,
        payload: {
          priceId,
          orderId,
        }
      })
    } catch (err) {
      console.warn(err);
    }
  }
}

interface CreateOrder {
  type: typeof CREATE_ORDER;
  payload: Order;
}

function createOrder(client: string, owner: string): Order {
  return {
    id: getId(10),
    date: new Date(),
    payment: PaymentMethod.Opened,
    client,
    owner,
  };
}

export function createOrderAction(client: string = 'incognito'): ThunkAction<CreateOrder> {
  return async(dispatch, getState) => {
    const userId: string = get(getState(), ['env', 'user', 'id']);
    const order = createOrder(client, userId);
    try {
      const idb = new CDB();
      await idb.addItem(C.TABLE.orders.name, order);
      dispatch({
        type: CREATE_ORDER,
        payload: order,
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

interface OrderComplete {
  type: typeof COMPLETE;
  payload: Order;
}

export function completeOrderAction(id: string, method: PaymentMethod.Opened | string): ThunkAction<OrderComplete> {
  return async(dispatch, getState) => {
    const order = get(getState(), ['ordersList', id]);
    const completeOrder = {...order, date: new Date(), payment: method };
    try {
      const idb = new CDB();
      await idb.updateItem(C.TABLE.orders.name, completeOrder);
      dispatch(addTransactionAction(completeOrder));
      dispatch({
        type: COMPLETE,
        payload: completeOrder,
      });
    } catch (err) {
      enrichException(err, completeOrder, EEventsTag.ORDER);
    }
  }
}

// ===== async ==========
export interface GetOrder {
  type: typeof GET_ORDER;
  payload: {
    order: Order;
    orderItems: Record<string, OrderItem>;
    prices: Record<string, PriceItem>;
    articles: Record<string, TMCItem>;
    processCards: Record<string, ProcessCardItem>;
    discounts: Record<string, DiscountItem>;
  }
}
export function getOrderAction(id: string): ThunkAction<GetOrder> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      const { order, ...res } = await idb.getOrder(id);
      dispatch({
        type: GET_ORDER,
        payload: {
          order,
          orderItems: adapters.orderItemsToRecord(res.orderItems),
          prices: pricesToDictionary(res.prices),
          articles: arrayToRecord(res.articles, 'barcode'),
          processCards: pcToDictionary(res.processCards),
          discounts: adapters.discountsToDictionary(res.discounts),
        }
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

interface RemoveOrder {
  type: typeof REMOVE_ORDER;
  payload: string;
}

export function removeOrderAction(id: string): ThunkAction<RemoveOrder> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      await idb.deleteItem(C.TABLE.orders.name, id);
      dispatch({
        type: REMOVE_ORDER,
        payload: id,
      })
    } catch (err) {
      console.warn(err);
    }
  }
}

// +++++++++++++++++++++
interface GetOrdersList {
  type: typeof GET_ORDERS_LIST;
  payload: Record<string, Order & { count: number }>;
}
export function getOrdersListAction(): ThunkAction<GetOrdersList> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      const orders = await idb.getOrderList();
      if (orders) {
        dispatch({
          type: GET_ORDERS_LIST,
          payload: adapters.ordersAdapter(orders),
        })
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface AddDiscount {
  type: typeof ADD_DISCOUNT;
  payload: DiscountItem,
}

export function addDiscountAction(item: DiscountItem, cb: () => void): ThunkAction<AddDiscount> {
  return async(dispatch) => {
    try {
      const idb = new CDB();
      await idb.addItem(C.TABLE.discountItem.name, item);
      dispatch({
        type: ADD_DISCOUNT,
        payload: item,
      })
      cb();
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface RemoveDiscount {
  type: typeof REMOVE_DISCOUNT;
  payload: {
    orderId: string,
    discountId: string,
  };
}

export function removeDiscountAction(orderId: string, discountId: string): ThunkAction<RemoveDiscount>  {
  return async (dispatch) => {
    try {
      const idb = new CDB();
      await idb.deleteItem(C.TABLE.discountItem.name, [orderId, discountId]);
      dispatch({
        type: REMOVE_DISCOUNT,
        payload: { orderId, discountId },
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export type Action = CreateOrder
  | IAddItem
  | UpdateQuantity
  | RemoveItem
  | GetOrder
  | OrderComplete
  | GetOrdersList
  | AddDiscount
  | RemoveDiscount
  | RemoveOrder
  ;

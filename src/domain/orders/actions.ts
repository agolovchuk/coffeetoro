import nanoid from 'nanoid';
import get from 'lodash/get';
import { Order, IOrderItem, Payment } from './Types';
import { Thunk } from '../StoreType';

// import { asyncAction } from 'lib/actionsHelper';

// export const AddOrderItem = asyncAction(
//   'ORDER/ADD_ORDER_ITEM',
//   (priceId: string, quantity: number) => ({ payload: { priceId, quantity }}),
// );

export const CREATE_ORDER = 'ORDERS/CREATE_ORDER';

export const ADD_ITEM = 'ORDER/ADD_ITEM';
export const UPDATE_QUANTITY = 'ORDER/UPDATE_QUANTITY';
export const UPDATE_ITEM = 'ORDER/UPDATE_ITEM';
export const REMOVE_ITEM = 'ORDER/REMOVE_ITEM';

interface IAddItem {
  type: typeof ADD_ITEM;
  payload: IOrderItem;
}

export function addItemAction(orderId: string, priceId: string, quantity: number): IAddItem {
  return {
    type: ADD_ITEM,
    payload: {
      orderId,
      priceId,
      quantity,
    }
  }
}

interface UpdateQuantity {
  type: typeof UPDATE_QUANTITY;
  payload: IOrderItem;
}

export function updateQuantityAction(orderId: string, priceId: string, quantity: number): UpdateQuantity {
  return {
    type: UPDATE_QUANTITY,
    payload: {
      orderId,
      priceId,
      quantity,
    }
  }
}

interface UpdateItem {
  type: typeof UPDATE_ITEM;
  payload: {
    orderId: string;
    prevPriceId: string;
    nextPriceId: string;
    quantity: number;
  }
}

export function updateItemAction(orderId: string, prevPriceId: string, nextPriceId: string): Thunk<UpdateItem, UpdateItem> {
  return (dispatch, getState) => dispatch({
    type: UPDATE_ITEM,
    payload: {
      orderId,
      prevPriceId,
      nextPriceId,
      quantity: get(getState(), ['ordersList', orderId, 'items', prevPriceId, 'quantity'], 0)
    }
  });
}

interface RemoveItem {
  type: typeof REMOVE_ITEM;
  payload: {
    orderId: string;
    priceId: string;
  };
}

export function removeItemAction(orderId: string, priceId: string): RemoveItem {
  return {
    type: REMOVE_ITEM,
    payload: {
      priceId,
      orderId,
    }
  }
}

interface CreateOrder {
  type: typeof CREATE_ORDER;
  payload: Order;
}

function createOrder(client: string): Order {
  return {
    id: nanoid(10),
    date: new Date().toISOString(),
    payment: Payment.Opened,
    client: client,
    items: {},
  };
}

export function createOrderAction(client: string = 'incognito'): CreateOrder {
  return {
    type: CREATE_ORDER,
    payload: createOrder(client),
  }
}

export type Action = ReturnType<typeof createOrderAction>
  |ReturnType<typeof addItemAction>
  | ReturnType<typeof updateQuantityAction>
  | ReturnType<ReturnType<typeof updateItemAction>>
  | ReturnType<typeof removeItemAction>
  ;
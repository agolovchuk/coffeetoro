import nanoid from 'nanoid';
import get from 'lodash/get';
import { Order, Payment, OrderItem } from './Types';
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

export const GET_ORDER = 'ORDER/GET_ORDER';
export const GET_ORDER_SUCCESS = 'ORDER/GET_ORDER/SUCCESS';

export const GET_ORDERS_LIST = 'ORDER/GET_ORDERS_LIST';
export const GET_ORDERS_LIST_SUCCESS = 'ORDER/GET_ORDERS_LIST_SUCCESS';
export const GET_ORDER_ITEMS_SUCCESS = 'ORDER/GET_ORDER_ITEMS_SUCCESS';

interface IAddItem {
  type: typeof ADD_ITEM;
  payload: OrderItem;
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
  payload: OrderItem;
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

function createOrder(client: string, owner: string): Order {
  return {
    id: nanoid(10),
    date: new Date().toISOString(),
    payment: Payment.Opened,
    client: client,
    owner,
  };
}

export function createOrderAction(client: string = 'incognito'): Thunk<CreateOrder, CreateOrder> {
  return (dispatch, getState) => dispatch({
    type: CREATE_ORDER,
    payload: createOrder(client, getState().env.user.id),
  })
}

// ===== async ==========
interface GetOrder {
  type: typeof GET_ORDER;
  payload: {
    id: string;
  }
}
export function getOrderAction(id: string): GetOrder {
  return {
    type: GET_ORDER,
    payload: {
      id,
    }
  }
}
interface GetOrderSuccess {
  type: typeof GET_ORDER_SUCCESS;
  payload: Order;
}
export function getOrderSuccessAction(o: Order): GetOrderSuccess {
  return {
    type: GET_ORDER_SUCCESS,
    payload: o,
  }
}
// +++++++++++++++++++++
interface GetOrdersList {
  type: typeof GET_ORDERS_LIST;
}
export function getOrdersListAction(): GetOrdersList {
  return {
    type: GET_ORDERS_LIST,
  }
}
interface GetOrdersListSuccess {
  type: typeof GET_ORDERS_LIST_SUCCESS;
  payload: Record<string, Order>;
}
export function getOrdersListSuccessAction(orders: Record<string, Order>): GetOrdersListSuccess {
  return {
    type: GET_ORDERS_LIST_SUCCESS,
    payload: orders,
  }
}
// +++++++++++++++++++++
interface GetOrderItemsSuccess {
  type: typeof GET_ORDER_ITEMS_SUCCESS;
  payload: Record<string, OrderItem>;
}
export function getOrderItemsSuccessAction(items: Record<string, OrderItem>): GetOrderItemsSuccess {
  return {
    type: GET_ORDER_ITEMS_SUCCESS,
    payload: items,
  }
}
// +++++++++++++++++++++

export type Action = ReturnType<ReturnType<typeof createOrderAction>>
  | ReturnType<typeof addItemAction>
  | ReturnType<typeof updateQuantityAction>
  | ReturnType<ReturnType<typeof updateItemAction>>
  | ReturnType<typeof removeItemAction>
  | ReturnType<typeof getOrderAction>
  | ReturnType<typeof getOrderSuccessAction>
  | ReturnType<typeof getOrdersListAction>
  | ReturnType<typeof getOrdersListSuccessAction>
  | ReturnType<typeof getOrderItemsSuccessAction>
  ;
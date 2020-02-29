import { createAction } from '@reduxjs/toolkit';
import get from 'lodash/get';
import { getId } from 'lib/id';
import { Order, PaymentMethod, OrderItem } from './Types';
import { Prices, PriceItem, CategoryItem } from 'domain/dictionary/Types';
import { Thunk } from '../StoreType';

export const CREATE_ORDER = 'ORDERS/CREATE_ORDER';

export const ADD_ITEM = 'ORDER/ADD_ITEM';
export const UPDATE_QUANTITY = 'ORDER/UPDATE_QUANTITY';
export const UPDATE_ITEM = 'ORDER/UPDATE_ITEM';
export const REMOVE_ITEM = 'ORDER/REMOVE_ITEM';
const COMPLETE = 'ORDER/COMPLETE';

export const GET_ORDER = 'ORDER/GET_ORDER';
const GET_ORDER_SUCCESS = 'ORDER/GET_ORDER/SUCCESS';

export const GET_ORDERS_LIST = 'ORDER/GET_ORDERS_LIST';
export const GET_ORDERS_LIST_SUCCESS = 'ORDER/GET_ORDERS_LIST_SUCCESS';
export const GET_ORDER_ITEMS_SUCCESS = 'ORDER/GET_ORDER_ITEMS_SUCCESS';

type PrepareAction<T> = (payload: T) => { payload: T };

function prepareAction<T>(payload: T) { 
  return {
    payload
  };
}

export interface IAddItem {
  type: typeof ADD_ITEM;
  payload: {
    item: OrderItem,
    price: PriceItem,
    category: CategoryItem,
  }
} 

export function addItemAction(orderId: string, priceId: string, quantity: number): Thunk<IAddItem, IAddItem> {
  return (dispatch, getState) => {
    const { prices, categories } = getState();
    const price = get(prices, priceId);
    return dispatch({
      type: ADD_ITEM,
      payload: {
        item: {
          orderId,
          priceId: get(price, 'id'),
          quantity,
        },
        price,
        category: get(categories, price.categoryName),
      }
    });
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
    id: getId(10),
    date: new Date().toISOString(),
    payment: PaymentMethod.Opened,
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

interface OrderComplete {
  id: string;
  method: PaymentMethod;
}

type PrepareComplete = (id: string, method: PaymentMethod) => { payload: OrderComplete };

export const completeOrderAction = createAction<PrepareComplete, typeof COMPLETE>(COMPLETE, (id: string, method: PaymentMethod) => ({ payload: { id, method }}));

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
  order: Order;
  orderItems: Record<string, OrderItem>;
  categories: Record<string, CategoryItem>;
  prices: Prices;
}

export const getOrderSuccessAction = createAction<PrepareAction<GetOrderSuccess>, typeof GET_ORDER_SUCCESS>(GET_ORDER_SUCCESS, prepareAction);

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
  | ReturnType<ReturnType<typeof addItemAction>>
  | ReturnType<typeof updateQuantityAction>
  | ReturnType<ReturnType<typeof updateItemAction>>
  | ReturnType<typeof removeItemAction>
  | ReturnType<typeof getOrderAction>
  | ReturnType<typeof completeOrderAction>
  | ReturnType<typeof getOrderSuccessAction>
  | ReturnType<typeof getOrdersListAction>
  | ReturnType<typeof getOrdersListSuccessAction>
  | ReturnType<typeof getOrderItemsSuccessAction>
  ;
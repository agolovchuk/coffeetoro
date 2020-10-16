import { startOfDay, endOfDay } from 'date-fns';
import groupBy from 'lodash/fp/groupBy';
import get from 'lodash/get';
import union from 'lodash/fp/union';
import {OrderArchiveContent, OrderArchiveItem} from './Types';
import { ThunkAction } from '../StoreType';
import CDB from 'db';
import * as adapters from "../dictionary/adapters";
import { PriceItem, ProcessCardItem, TMCItem } from "../dictionary";
import { orderItemsArchive } from 'domain/orders/helpers';
import { OrderItem } from 'domain/orders';

export const GET_DAILY = 'REPORTS/GET_DAILY';
export const ADD_ORDER_ITEM_SUCCESS = 'REPORT/ADD_ORDER_ITEM_SUCCESS';
export const COMPLETE = 'REPORT/COMPLETE';
export const GET_ORDERS_REQUEST = 'REPORT/GET_ORDERS_REQUEST';
export const GET_ORDERS_SUCCESS = 'REPORT/GET_ORDERS_SUCCESS';
export const GET_ENTRY_PRICE = 'REPORT/GET_ENTRY_PRICE';

interface GetDailyReport {
  type: typeof GET_DAILY;
  payload: {
    from: string,
    to: string,
  };
}

export function getDailyReportAction(from: string, to?: string): GetDailyReport {
  const fromDate = startOfDay(new Date(from)).toISOString();
  const toDate = endOfDay(new Date(to || from)).toISOString();
  return {
    type: GET_DAILY,
    payload: {
      from: fromDate,
      to: toDate,
    },
  }
}

interface GetOrders {
  type: typeof GET_ORDERS_REQUEST;
  payload: {
    from: string,
    to: string,
  };
}

export function getOrdersAction(from: string, to?: string): GetOrders {
  const fromDate = startOfDay(new Date(from)).toISOString();
  const toDate = endOfDay(new Date(to || from)).toISOString();
  return {
    type: GET_ORDERS_REQUEST,
    payload: {
      from: fromDate,
      to: toDate,
    },
  }
}

export interface GetOrderSuccess {
  type: typeof GET_ORDERS_SUCCESS;
  payload: {
    prices: Record<string, PriceItem>;
    articles: Record<string, TMCItem>;
    processCards: Record<string, ProcessCardItem>;
    orders: Record<string, OrderArchiveItem>;
  }
}


export function getOrdersSuccessAction(orders: Record<string, OrderArchiveItem>): ThunkAction<GetOrderSuccess>  {
  return async dispatch => {
    let priceIds: ReadonlyArray<string> = [];
    try {
      for (const key in orders) {
        const items = get(orders, [key, 'items'], [] as ReadonlyArray<OrderArchiveContent>);
        const ids = items.map(e => e.priceId);
        priceIds = union(ids)(priceIds);
      }
      if (priceIds.length) {
        const idb = new CDB();
        const { articles, processCards, prices } = await idb.getPricesById(priceIds);
        dispatch({
          type: GET_ORDERS_SUCCESS,
          payload: {
            prices: adapters.pricesToDictionary(prices),
            articles: adapters.articlesToDictionary(articles),
            processCards: adapters.pcToDictionary(processCards),
            orders,
          }
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }
}


export function getDailyLocalAction(from: string, to?: string): ThunkAction<GetOrderSuccess> {
  return async dispatch => {
    const fromDate = startOfDay(new Date(from));
    const toDate = endOfDay(new Date(to || from));
    try {
      const idb = new CDB();
      const { articles, orders, orderItems, processCards, prices, discounts } = await idb.getOrdersByDate(fromDate, toDate);
      const it = groupBy('orderId')(orderItems);
      const d = groupBy('orderId')(discounts);
      const priceDictionary = adapters.pricesToDictionary(prices);
      const o = orders.reduce((a, v) => ({
        ...a,
        [v.id]: {
          ...v,
          date: v.date.toISOString(),
          items: orderItemsArchive(get(it, v.id, []) as ReadonlyArray<OrderItem>, priceDictionary),
          discounts: get(d, v.id),
        }
      }), {});

      dispatch({
        type: GET_ORDERS_SUCCESS,
        payload: {
          orders: o,
          prices: priceDictionary,
          articles: adapters.articlesToDictionary(articles),
          processCards: adapters.pcToDictionary(processCards),
        }
      });

    } catch (err) {
      console.warn(err);
    }
  }
}

export interface AddOrderItem {
  type: typeof ADD_ORDER_ITEM_SUCCESS,
  payload: {
    order: OrderArchiveItem;
    articles: Record<string, TMCItem>;
    processCards: Record<string, ProcessCardItem>;
    prices: Record<string, PriceItem>;
  },
}

export function addOrderItemAction(order: OrderArchiveItem): ThunkAction<AddOrderItem> {
  return async (dispatch) => {
    try {
      const idb = new CDB();
      const { articles, processCards, prices } = await idb.getPricesById(order.items.map(({ priceId }) => priceId));
      dispatch({
        type: ADD_ORDER_ITEM_SUCCESS,
        payload: {
          order,
          prices: adapters.pricesToDictionary(prices),
          articles: adapters.articlesToDictionary(articles),
          processCards: adapters.pcToDictionary(processCards),
        },
      })
    } catch (err) {
      console.warn(err);
    }
  }
}

export interface CompleteReport {
  type: typeof COMPLETE;
  payload: string;
}

export function completeReportAction(date: string): CompleteReport {
  return  {
    type: COMPLETE,
    payload: date,
  }
}

//++++++++++++++++

export interface GetEntryPrice {
  type: typeof GET_ENTRY_PRICE;
  payload: Record<string, number>;
}

export function getEntryPriceAction(): ThunkAction<GetEntryPrice>  {
  return async (dispatch) => {
    try {
      const idb = new CDB();
      const res = await idb.getEntryPrice();
      dispatch({
        type: GET_ENTRY_PRICE,
        payload: res,
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export type Action = GetDailyReport
  | AddOrderItem
  | GetOrders
  | GetOrderSuccess
  | GetEntryPrice
  | CompleteReport;

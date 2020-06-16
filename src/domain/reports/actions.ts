import { startOfDay, endOfDay } from 'date-fns';
import groupBy from 'lodash/fp/groupBy';
import get from 'lodash/get';
import { OrderArchiveItem } from './Types';
import { ThunkAction } from '../StoreType';
import CDB from 'db';
import * as adapters from "../dictionary/adapters";
import { PriceItem, ProcessCardItem, TMCItem } from "../dictionary";
import { orderItemsArchive } from 'domain/orders/helpers';
import { OrderItem } from 'domain/orders';

export const GET_DAILY = 'REPORTS/GET_DAILY';
export const ADD_ORDER_ITEM_SUCCESS = 'REPORT/ADD_ORDER_ITEM_SUCCESS';
export const GET_ORDERS = 'REPORT/GET_ORDERS';
export const COMPLETE = 'REPORT/COMPLETE';

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

export interface GetDailyLocal {
  type: typeof GET_ORDERS;
  payload: {
    prices: Record<string, PriceItem>;
    articles: Record<string, TMCItem>;
    processCards: Record<string, ProcessCardItem>;
    orders: Record<string, OrderArchiveItem>;
  }
}

export function getDailyLocalAction(from: string, to?: string): ThunkAction<GetDailyLocal> {
  return  async dispatch => {
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
        type: GET_ORDERS,
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
  return async (dispatch, getState) => {
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

export type Action = GetDailyReport
  | AddOrderItem
  | GetDailyLocal
  | CompleteReport;

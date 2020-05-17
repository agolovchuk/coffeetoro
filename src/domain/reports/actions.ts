import { OrderArchiveItem } from './Types';
import { ThunkAction } from '../StoreType';
import CDB from 'db';
import * as adapters from "../dictionary/adapters";
import { PriceItem, ProcessCardItem, TMCItem } from "../dictionary";

export const GET_DAILY = 'REPORTS/GET_DAILY';
export const ADD_ORDER_ITEM_SUCCESS = 'REPORT/ADD_ORDER_ITEM_SUCCESS'
export const COMPLETE = 'REPORT/COMPLETE';

interface GetDailyReport {
  type: typeof GET_DAILY;
  payload: string;
}

export function getDailyReportAction(date: string): GetDailyReport {
  return {
    type: GET_DAILY,
    payload: date,
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
  | CompleteReport;

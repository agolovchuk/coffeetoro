import { format } from 'date-fns';
import CDB from "db";
import * as C from 'db/constants';
import * as adapter from './adapters';
import { DayItem } from './Types';
import { ThunkAction } from '../StoreType';

export const SET_DAY_PARAMS = 'DAILY/SET_DAY_PARAMS';
export const GET_DAY_PARAMS = 'DAILY/GET_DAY_PARAMS';

interface SetDayPrams {
  type: typeof SET_DAY_PARAMS;
  payload: DayItem;
}

export function setDayParamsAction(data: Partial<DayItem>, day?: string, cb?: () => void): ThunkAction<SetDayPrams> {
  return async (dispatch) => {
    try {
      const date = day || format(new Date(), 'yyyy-MM-dd');
      const dailyItem = { ...data, date: new Date(date), dateKey: date };
      const Idb = new CDB();
      await Idb.updateItem(C.TABLE.daily.name, dailyItem);
      dispatch({
        type: SET_DAY_PARAMS,
        payload: dailyItem,
      });
      if (typeof cb === "function") cb();
    } catch (err) {
      console.warn(err);
    }
  }
}

interface GetDayParams {
  type: typeof GET_DAY_PARAMS;
  payload: DayItem;
}

export function getDayParamsAction(date: string): ThunkAction<GetDayParams> {
  return async (dispatch) => {
    try {
      const Idb = new CDB();
      const data = await Idb.getItem(C.TABLE.daily.name, adapter.dayParamsValidator, date);
      dispatch({
        type: GET_DAY_PARAMS,
        payload: data,
      })
    } catch (err) {
      console.warn(err);
    }
  }
}

export type Action = SetDayPrams
 | GetDayParams;

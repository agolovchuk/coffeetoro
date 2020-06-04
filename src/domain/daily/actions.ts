import { format } from 'date-fns';
import CDB from "db";
import * as C from 'db/constants';
import { DayItem } from './Types';
import { ThunkAction } from '../StoreType';

export const SET_DAY_PARAMS = 'DAILY/SET_DAY_PARAMS';

interface SetDayPrams {
  type: typeof SET_DAY_PARAMS;
  payload: DayItem;
}

export function setDayParamsAction(data: Partial<DayItem>, day: string, cb: () => void): ThunkAction<SetDayPrams> {
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
      cb();
    } catch (err) {
      console.warn(err);
    }
  }
}

export type Action = SetDayPrams;

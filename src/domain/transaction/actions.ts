import { EEventsTag, enrichException } from 'lib/loger';
import { ADD_TRANSACTION } from './constants';
import { IAddTransaction } from './Types';
import { ThunkAction } from '../StoreType';
import { IOrderContainer, orderToTransactionAction } from './helpers';

export function addTransactionAction(order: IOrderContainer): ThunkAction<IAddTransaction> {
  return async(dispatch, getState) => {
    try {
      const transaction = await orderToTransactionAction(getState, order);
      dispatch({
        type: ADD_TRANSACTION,
        payload: transaction,
      })
    } catch (err) {
      enrichException(err, order, EEventsTag.TRANSACTION);
    }
  }
}

import { validateArray, dictionaryAdapterFactory } from 'lib/contracts';
import { arrayToRecord } from 'lib/dataHelper';
import { order } from './contracts';
import { OrderItem } from './Types';

export const orderItemsToRecord = (arr: ReadonlyArray<OrderItem>) => arrayToRecord(arr, 'priceId');

export const ordersAdapter = validateArray(dictionaryAdapterFactory(order, 'id'));

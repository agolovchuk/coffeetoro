import { validateArray, dictionaryAdapterFactory } from 'lib/contracts';
import { arrayToRecord } from 'lib/dataHelper';
import { order } from './contracts';
import { DiscountItem, OrderItem } from './Types';

export const orderItemsToRecord = (arr: ReadonlyArray<OrderItem>) => arrayToRecord(arr, 'priceId');
export const discountsToDictionary = (arr: DiscountItem[]) => arrayToRecord(arr, 'discountId');

export const ordersAdapter = validateArray(dictionaryAdapterFactory(order, 'id'));

import * as t from 'typed-contracts';
import { validate } from '../../lib/contracts';

const order = t.isObject({
  id: t.isString,
  date: t.isString,
  client: t.isString,
  payment: t.isNumber,
  owner: t.isString,
})('order');

export const validateOrder = validate(order);

const orderItem = t.isObject({
  orderId: t.isString,
  priceId: t.isString,
  quantity: t.isNumber,
})('orderItem');

export const validateOrderItem = validate(orderItem);

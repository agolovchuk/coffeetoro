import * as t from 'io-ts';
import { date } from 'io-ts-types/lib/date';

export const order = t.interface({
  id: t.string,
  date: date,
  client: t.string,
  payment: t.number,
  owner: t.string,
});

export const orderItem = t.interface({
  orderId: t.string,
  priceId: t.string,
  quantity: t.number,
});

export const discountItem = t.interface({
  orderId: t.string,
  discountId: t.string,
  valuation: t.number,
});

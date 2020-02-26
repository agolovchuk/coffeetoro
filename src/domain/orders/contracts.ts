import * as t from 'io-ts';

export const order = t.interface({
  id: t.string,
  date: t.string,
  client: t.string,
  payment: t.number,
  owner: t.string,
});

export const orderItem = t.interface({
  orderId: t.string,
  priceId: t.string,
  quantity: t.number,
});

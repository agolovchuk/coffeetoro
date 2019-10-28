import { createSelector } from 'reselect';
import { params } from 'domain/routes';
import { priceByID, productByName, volume } from '../dictionary/selectors';
import { getOrderItem } from './helpers';
import { OrderState } from './Types';

export const orders = (state: OrderState) => state.order;

export const ordersSelector = createSelector(
  [orders, priceByID, productByName, volume],
  (o, p, pd, v) => getOrderItem(o, p, pd, v),
);

export const orderByProductSelector = createSelector(
  [ordersSelector, params],
  (o, p) => o.filter(f => f.product.name === p.product),
);

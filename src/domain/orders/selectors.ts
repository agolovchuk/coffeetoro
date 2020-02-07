import { createSelector } from 'reselect';
import get from 'lodash/get'
import { params } from 'domain/routes';
import { sortByDate } from 'lib/dateHelper';
import { priceByID, productByName, volume } from '../dictionary/selectors';
import { getOrderItem,  } from './helpers';
import { OrderState } from './Types';

export const ordersById = (state: OrderState) => state.ordersList;

// Filter order items list for specific order 
const orderItemSelector = createSelector(
  [ordersById, params],
  (o, p) => p.orderId ? Object.values(get(o, [p.orderId, 'items'], [])) : [],
)

export const ordersSelector = createSelector(
  [orderItemSelector, priceByID, productByName, volume],
  (o, p, pd, v) => getOrderItem(o, p, pd, v),
);

export const orderByProductSelector = createSelector(
  [ordersSelector, params],
  (o, p) => o.filter(f => f.product.name === p.product),
);

export const ordersListSelector = createSelector(
  [ordersById],
  o => Object.values(o).sort(sortByDate('date'))
)

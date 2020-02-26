import { createSelector } from 'reselect';
import { params } from 'domain/routes';
import { sortByDate } from 'lib/dateHelper';
import { units } from '../dictionary/selectors';
import { getOrderItem } from './helpers';
import { OrderState } from './Types';

export const ordersById = (state: OrderState) => state.ordersList;
export const orderItems = (state: OrderState) => state.orderItems;
const orderDictionary = (state: OrderState) => state.orderDictionary;

const priceByID = createSelector(orderDictionary, d => d.prices);
const productByName = createSelector(orderDictionary, d => d.products);

// Filter order items list for specific order 
const orderItemSelector = createSelector(
  [orderItems, params],
  (o, p) => p.orderId ? Object.values(o) : [],
)

export const ordersSelector = createSelector(
  [orderItemSelector, priceByID, productByName , units],
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

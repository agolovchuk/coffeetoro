import { createSelector } from 'reselect';
import { params } from 'domain/routes';
import { sortByDate } from 'lib/dateHelper';
import { units } from '../dictionary/selectors';
import { getOrderItem } from './helpers';
import { OrderState, OrderItem } from './Types';

export const ordersById = (state: OrderState) => state.ordersList;
export const orderItems = (state: OrderState) => state.orderItems;
const orderDictionary = (state: OrderState) => state.orderDictionary;

const priceByID = createSelector(orderDictionary, d => d.prices);
const categoryByName = createSelector(orderDictionary, d => d.categories);

// Filter order items list for specific order 
const orderItemSelector = createSelector(
  [orderItems, params],
  (o, p) => p.orderId ? Object.values(o) : [] as OrderItem[],
)

export const ordersSelector = createSelector(
  [orderItemSelector, priceByID, categoryByName , units],
  (o, p, pd, v) => getOrderItem(o, p, pd, v),
);

export const orderByProductSelector = createSelector(
  [ordersSelector, params],
  (o, p) => o.filter(f => f.category.name === p.category),
);

export const ordersListSelector = createSelector(
  [ordersById],
  o => Object.values(o).sort(sortByDate('date'))
)

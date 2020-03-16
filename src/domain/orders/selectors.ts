import { createSelector } from 'reselect';
import { params } from 'domain/routes';
import { sortByDate } from 'lib/dateHelper';
import { units } from '../dictionary/selectors';
import { getOrderItem, orderItemsArchive } from './helpers';
import { OrderState, PaymentMethod } from './Types';

export const ordersById = (state: OrderState) => state.ordersList;
export const orderItems = (state: OrderState) => state.orderItems;
const orderDictionary = (state: OrderState) => state.orderDictionary;

const priceByID = createSelector(orderDictionary, d => d.prices);
const categoryById = createSelector(orderDictionary, d => d.categories);
const corderItemsListSelectors = createSelector(orderItems, o => Object.values(o));

// Filter order items list for specific order 
const orderItemSelector = createSelector(
  [corderItemsListSelectors, params],
  (o, p) => o.filter(f => f.orderId === p.orderId),
)

export const orderArchiveSelector = createSelector(
  [orderItemSelector, priceByID], orderItemsArchive,
);

export const ordersSelector = createSelector(
  [orderItemSelector, priceByID, categoryById , units],
  (o, p, pd, v) => getOrderItem(o, p, pd, v),
);

export const orderByProductSelector = createSelector(
  [ordersSelector, params],
  (o, p) => o.filter(f => f.category.id === p.categoryId),
);

export const ordersListSelector = createSelector(
  [ordersById],
  o => Object
    .values(o)
    .filter(f => f.payment === PaymentMethod.Opened)
    .sort(sortByDate('date'))
)

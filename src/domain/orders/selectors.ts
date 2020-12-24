import { createSelector } from 'reselect';
import { params } from 'domain/routes';
import { userSelector } from 'domain/env';
import { sortByDate } from 'lib/dateHelper';
import { arrayToRecord } from 'lib/dataHelper';
import { getOrderItem, orderItemsArchive, orderFilter } from './helpers';
import { OrderState } from './Types';
import { extendsPriceList } from 'domain/dictionary/helpers';
import { toArray } from 'lib/dataHelper';

export const ordersById = (state: OrderState) => state.ordersList;
export const orderItems = (state: OrderState) => state.orderItems;
const orderDictionary = (state: OrderState) => state.orderDictionary;
const discountItems = (state: OrderState) => state.discountItems;

const priceByID = createSelector(orderDictionary, d => d.prices);

export const discountsListSelector = createSelector([discountItems], toArray);

const extendsPriceListSelector = createSelector(orderDictionary,
  d => extendsPriceList(Object.values(d.prices), d.articles, d.processCards)
);

const extendsPriceByIdSelector = createSelector(extendsPriceListSelector,
  p => arrayToRecord(p, 'id')
)

// const categoryById = createSelector(orderDictionary, d => d.categories);
const orderItemsListSelectors = createSelector(orderItems, toArray);

// Filter order items list for specific order
const orderItemSelector = createSelector(
  [orderItemsListSelectors, params],
  (o, p) => o.filter(f => f.orderId === p.orderId),
)

export const orderArchiveSelector = createSelector(
  [orderItemSelector, priceByID], orderItemsArchive,
);

export const ordersSelector = createSelector(
  [orderItemSelector, extendsPriceByIdSelector],
  (o, p) => getOrderItem(o, p),
);

export const orderByProductSelector = createSelector(
  [ordersSelector, params],
  (o, p) => o.filter(f => f.price.parentId === p.categoryId),
);

const ordersList = createSelector(
  [ordersById],
  o => Object.values(o).sort(sortByDate('date')),
)



export const myOrdersListSelector = createSelector(
  [ordersList, userSelector],
  orderFilter,
)

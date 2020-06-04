import sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';
import { extendsPrice } from '../dictionary/helpers';
import { priceByNameSelector, articlesByBarcodeSelector, processCards, PriceExtended } from 'domain/dictionary';
import { ReportState, OrderArchiveItem } from './Types';
import { enrichOrdersArchive, byPriceId, orderSum, extendsItems, discountSum } from './helpers';

const orders = (state: ReportState) => state.reports;

const ordersSelector = createSelector([orders], o => sortBy(o, 'date'));

export const summarySelector = createSelector(
  [orders],
  (o) => o.reduce((a, v) => {
  return {
    cash: v.payment === 1 ? a.cash + orderSum(v) : a.cash,
    bank: v.payment === 2 ? a.bank + orderSum(v) : a.bank,
    discount: a.discount + (discountSum(v.discounts) / 1000),
    income: a.income + orderSum(v),
    orders: a.orders + 1,
    items: byPriceId(v, a.items),
  }
}, { income: 0, orders: 0, cash: 0, bank: 0, discount: 0, items: {} }));

export const articlesSelector = createSelector(
  [summarySelector, priceByNameSelector, articlesByBarcodeSelector, processCards],
  (s, p, tmc, pc) => extendsItems(s.items, p, tmc, pc),
)

type EnrichedOrder = Omit<OrderArchiveItem, 'items'> & {
  items: ReadonlyArray<PriceExtended & { quantity: number}>
}

export const enrichedOrdersSelector = createSelector(
  [ordersSelector, priceByNameSelector, articlesByBarcodeSelector, processCards],
  (o, p, tmc, pc) => {
    const enrich = (id: string) => extendsPrice(p[id], tmc, pc);
    return o.reduce((a, v) => [...a, enrichOrdersArchive(v, enrich)], [] as ReadonlyArray<EnrichedOrder>);
  }
)

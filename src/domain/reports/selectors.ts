import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import { createSelector } from 'reselect';
import { toArray } from 'lib/dataHelper';
import { format } from 'date-fns';
import { extendsPrice } from '../dictionary/helpers';
import {
  priceByNameSelector,
  articlesByBarcodeSelector,
  processCards,
  PriceExtended, PriceExtendedBase, PriceTMC, PricePC,
} from 'domain/dictionary';
import { ReportState, OrderArchiveItem, EntryPriceItem } from './Types';
import { enrichOrdersArchive, byPriceId, orderSum, extendsItems, discountSum } from './helpers';

const orders = (state: ReportState) => state.reports;
export const entryPriceSelector = (state: ReportState) => state.entryPrice;

const ordersListSelector = createSelector([orders], toArray);

const ordersSelector = createSelector([ordersListSelector], o => sortBy(o, 'date'));

export const summarySelector = createSelector(
  [ordersListSelector],
  (o) => o.reduce((a, v) => {
  return {
    cash: v.payment === 1 ? a.cash + orderSum(v) : a.cash,
    bank: v.payment === 2 ? a.bank + orderSum(v) : a.bank,
    discount: a.discount + (discountSum(v.discounts)),
    income: a.income + orderSum(v),
    orders: a.orders + 1,
    items: byPriceId(v, a.items),
  }
}, { income: 0, orders: 0, cash: 0, bank: 0, discount: 0, items: {} }));

export const productsSelector = createSelector(
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

export const ordersByDateSelector = createSelector(
  [ordersListSelector],
  (o) => groupBy(o, e => format(new Date(e.date), 'yyyy-MM-dd')),
)

interface ExtendedTMC extends PriceExtendedBase, PriceTMC {
  quantity: number
}

interface ExtendedPC extends PriceExtendedBase, PricePC {
  quantity: number
}

interface EXP {
  tmc: ReadonlyArray<ExtendedTMC & { p: EntryPriceItem | undefined }>,
  pc: ReadonlyArray<ExtendedPC>,
}

export const expSelector = createSelector(
  [productsSelector, entryPriceSelector],
  (p, e):EXP => {
    const tmc = p.filter(f => f.type === 'tmc') as ReadonlyArray<ExtendedTMC>;
    const pc = p.filter(f => f.type === 'pc') as ReadonlyArray<ExtendedPC>;
    return {
      tmc: tmc.map(m => ({ ...m, p: get(e, m.barcode) })),
      pc
    }
  },
);

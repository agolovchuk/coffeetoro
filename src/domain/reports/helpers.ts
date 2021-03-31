import get from 'lodash/get';
import { summa } from 'lib/decimal';
import { OrderArchiveContent, OrderArchiveItem } from './Types';
import { PriceExtended, PriceItem, ProcessCardItem, TMCItem } from 'domain/dictionary/Types';
import { DiscountItem } from 'domain/orders';
import { extendsPriceList } from "domain/dictionary/helpers";

function getOrderItems(o: OrderArchiveItem): ReadonlyArray<OrderArchiveContent> {
  return get(o, 'items', [] as ReadonlyArray<OrderArchiveContent>);
}

export function enrichOrdersArchive(order: OrderArchiveItem, en: (id: string) => PriceExtended) {
  return {
    ...order,
    items: getOrderItems(order).map(e => ({ ...en(e.priceId), quantity: e.quantity })),
  }
}

export function byPriceId(order: OrderArchiveItem, start: Record<string, number>) {
  return getOrderItems(order)
    .reduce((a, v) => ({ ...a, [v.priceId]: (a[v.priceId] || 0) + v.quantity }), start);
}

export function orderSum(order: OrderArchiveItem) {
  return summa(getOrderItems(order)) - discountSum(order.discounts);
}

export function discountSum(discounts?: ReadonlyArray<DiscountItem>): number {
  if (!discounts || discounts.length < 1) return 0;
  return summa(discounts);
}

export function extendsItems(
  items: Record<string, number>,
  pricesDictionary: Record<string, PriceItem>,
  articles: Record<string, TMCItem>,
  pc: Record<string, ProcessCardItem>,
) {
  const prices = Object.keys(items).map(e => pricesDictionary[e]);
  return extendsPriceList(prices, articles, pc)
    .map(e => ({ ...e, quantity: get(items, e.id) }))
    .sort((a, b) => get(a, 'title', '').localeCompare(get(b, 'title', '')));
}

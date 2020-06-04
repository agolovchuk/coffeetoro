import { OrderArchiveItem,  } from './Types';
import { PriceExtended, PriceItem, ProcessCardItem, TMCItem } from 'domain/dictionary/Types';
import { DiscountItem } from 'domain/orders';
import { extendsPriceList } from "domain/dictionary/helpers";

export function enrichOrdersArchive(order: OrderArchiveItem, en: (id: string) => PriceExtended) {
  return {
    ...order,
    items: order.items.map(e => ({ ...en(e.priceId), quantity: e.quantity })),
  }
}

export function byPriceId(order: OrderArchiveItem, start: Record<string, number>) {
  return order
    .items
    .reduce((a, v) => ({ ...a, [v.priceId]: (a[v.priceId] || 0) + v.quantity }), start);
}

export function orderSum(order: OrderArchiveItem) {
  const ds = discountSum(order.discounts);
  return order.items.reduce((a, v) => a + v.quantity * v.valuation, - ds) / 1000;
}

export function discountSum(discounts?: ReadonlyArray<DiscountItem>): number {
  if (!discounts || discounts.length < 1) return 0;
  return discounts.reduce((a, v) => a + v.valuation, 0);
}

export function extendsItems(
  items: Record<string, number>,
  pricesDictionary: Record<string, PriceItem>,
  articles: Record<string, TMCItem>,
  pc: Record<string, ProcessCardItem>,
) {
  const prices = Object.keys(items).map(e => pricesDictionary[e]);
  return extendsPriceList(prices, articles, pc)
    .map(e => ({ ...e, quantity: items[e.id] }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

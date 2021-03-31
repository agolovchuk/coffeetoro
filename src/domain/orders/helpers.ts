import currency from 'currency.js';
import get from 'lodash/get';
import { PriceItem, PriceExtended, TMCItem, ProcessCardItem } from 'domain/dictionary/Types';
import { PaymentMethod } from 'domain/orders/Types';
import { OrderItem, OrderItemContainer, Order, DiscountItem } from './Types';
import { IUser, UserRole } from "../env";

function priceAdapter(
  order: OrderItem,
  priceByID: Record<string, PriceExtended>,
) {
  const price = get(priceByID, order.priceId);
  if (typeof price === 'undefined') throw new TypeError('No price found:' + order.priceId);
  return {
    quantity: order.quantity,
    price,
  }
}

export function getOrderItem(
  orders: ReadonlyArray<OrderItem>,
  prices: Record<string, PriceExtended>,
): ReadonlyArray<OrderItemContainer> {
  return orders
    .map(o => (priceAdapter(o, prices)))
}

interface OrderItemArchive {
  quantity: number;
  valuation: number;
  priceId: string;
}

export function orderItemsArchive(
  orders: ReadonlyArray<OrderItem>,
  prices: Record<string, PriceItem>,
): ReadonlyArray<OrderItemArchive> {
  return orders.map(({ quantity, priceId }) => {
    const { valuation } = get(prices, priceId);
    return { quantity, valuation, priceId }
  });
}

export function prepareDictionary(
  price: PriceItem,
  articles: Record<string, TMCItem>,
  pc: Record<string, ProcessCardItem>,
) {
  if (price.type === 'tmc') {
    const tmc = articles[price.barcode];
    if (typeof tmc === 'undefined' || typeof tmc.barcode === 'undefined') throw Error('No Article in Dictionary');
    return {
      articles: { [tmc.barcode]: tmc },
      processCards: {},
    }
  }
  const card = pc[price.refId];
  if (typeof card === 'undefined') throw Error('No Card in Process Card Dictionary');
  return {
    articles: {},
    processCards: { [card.id]: card },
  }
}

export function orderFilter<T extends Order>(o: T[], u: IUser | null): T[] {
  if (u?.role === UserRole.MANAGER) return o.filter(f => f.payment === PaymentMethod.Opened);
  const filter = (f: T) => f.owner === u?.id && f.payment === PaymentMethod.Opened;
  return o.filter(filter);
}

export function orderItemsFromOrder(orderId: string | undefined, orderItems: ReadonlyArray<OrderItem>) {
  return orderItems.filter(f => f.orderId === orderId);
}

export function orderSumm(
  order: ReadonlyArray<OrderItem>,
  discount: ReadonlyArray<DiscountItem>,
  prices: Record<string, PriceItem>,
): number {
  return order
    .reduce((a, v) => a.add(currency(get(prices, [v.priceId, 'valuation'])).multiply(v.quantity)), currency(0))
    .subtract(discount.reduce((a, v) => a.add(v.valuation),  currency(0)))
    .value;
}

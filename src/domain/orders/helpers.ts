import get from 'lodash/get';
import { PriceItem, PriceExtended, TMCItem, ProcessCardItem } from 'domain/dictionary/Types';
import { PaymentMethod } from 'domain/orders/Types';
import { OrderItem, OrderItemContainer, Order } from './Types';
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
    const { valuation } = prices[priceId];
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
  if (u?.role === UserRole.MANAGER) return o;
  const filter = (f: T) => f.owner === u?.id && f.payment === PaymentMethod.Opened;
  return o.filter(filter);
}

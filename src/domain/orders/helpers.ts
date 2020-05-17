import get from 'lodash/get';
import { OrderItem, OrderItemContainer } from './Types';
import { PriceItem, PriceExtended, TMCItem, ProcessCardItem } from '../dictionary/Types';

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

interface Order {
  valuation: number;
  quantity: number;
}

export function getSumOfOrder(list: ReadonlyArray<Order>): number {
  return list.reduce((a, v) => a + (v.valuation * v.quantity), 0);
}

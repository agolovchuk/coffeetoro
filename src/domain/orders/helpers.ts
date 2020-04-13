import get from 'lodash/get';
import { OrderItem, OrderItemContainer } from './Types';
import { PriceItem, PriceExtendet, TMCItem, ProcessCardItem } from '../dictionary/Types';
import find from 'lodash/find';

function priceAdapter(
  order: OrderItem,
  priceByID: Record<string, PriceExtendet>,
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
  prices: Record<string, PriceExtendet>,
): ReadonlyArray<OrderItemContainer> {
  return orders
    .map(o => (priceAdapter(o, prices)))
}

interface OrderItemArchive {
  quantity: number;
  valuation: number;
  categoryId: string;
  priceId: string;
}

export function orderItemsArchive(
  orders: ReadonlyArray<OrderItem>,
  prices: Record<string, PriceItem>,
): ReadonlyArray<OrderItemArchive> {
  return orders.map(({ quantity, priceId }) => {
    const { valuation, parentId } = prices[priceId];
    return { quantity, valuation, categoryId: parentId, priceId }
  });
}

export function prepereDictionary(
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
  if (typeof card === 'undefined') throw Error('No Card in Procces Card Dictionary');
  return {
    articles: {},
    processCards: { [card.id]: card },
  }
}

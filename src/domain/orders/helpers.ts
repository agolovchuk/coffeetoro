import get from 'lodash/get';
import { OrderItem, OrderItemContainer } from './Types';
import { PriceItem, Units, CategoryItem } from '../dictionary/Types';

function priceAdapter(
  order: OrderItem,
  priceByID: Record<string, PriceItem>,
  categoryById: Record<string, CategoryItem>,
  units: Units,
) {
  const price = get(priceByID, order.priceId);
  if (typeof price === 'undefined') throw new TypeError('No price found:' + order.priceId);
  return {
    quantity: order.quantity,
    price,
    category: get(categoryById, get(price, 'categoryId')),
    volume: get(units, get(price, 'unitId')),
  }
}

export function getOrderItem(
  orders: ReadonlyArray<OrderItem>,
  prices: Record<string, PriceItem>,
  categories: Record<string, CategoryItem>,
  units: Units,
): ReadonlyArray<OrderItemContainer> {
  return orders
    .map(o => (priceAdapter(o, prices, categories, units )))
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
    const { valuation, categoryId } = prices[priceId];
    return { quantity, valuation, categoryId, priceId }
  });
}

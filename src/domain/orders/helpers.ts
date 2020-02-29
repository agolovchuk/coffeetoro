import get from 'lodash/get';
import { OrderItem, OrderItemContainer } from './Types';
import { PriceItem, Units, CategoryItem } from '../dictionary/Types';

function priceAdapter(
  order: OrderItem,
  priceByID: Record<string, PriceItem>,
  categoryByName: Record<string, CategoryItem>,
  units: Units,
) {
  const price = get(priceByID, order.priceId);
  return {
    quantity: order.quantity,
    price,
    category: get(categoryByName, price.categoryName),
    volume: get(units, price.unitId),
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

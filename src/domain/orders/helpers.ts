import get from 'lodash/get';
import { OrderItem, OrderItemContainer } from './Types';
import { PriceItem, ProductItem, Units } from '../dictionary/Types';

function priceAdapter(
  order: OrderItem,
  priceByID: Record<string, PriceItem>,
  productByName: Record<string, ProductItem>,
  units: Units,
) {
  const price = get(priceByID, order.priceId);
  return {
    quantity: order.quantity,
    price,
    product: get(productByName, price.productName),
    volume: get(units, price.unitId),
  }
}

export function getOrderItem(
  orders: ReadonlyArray<OrderItem>,
  prices: Record<string, PriceItem>,
  products: Record<string, ProductItem>,
  units: Units,
): ReadonlyArray<OrderItemContainer> {
  return orders
    .map(o => (priceAdapter(o, prices, products, units )))
}

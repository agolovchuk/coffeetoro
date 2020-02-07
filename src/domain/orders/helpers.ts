import { OrderItem, OrderItemContainer } from './Types';
import { PriceItem, ProductItem, Volume } from '../dictionary/Types';

function priceAdapter(
  order: OrderItem,
  priceByID: Map<string, PriceItem>,
  productByName: Map<string, ProductItem>,
  volume: Volume,
) {
  const price = priceByID.get(order.priceId) as PriceItem;
  return {
    quantity: order.quantity,
    price,
    product: productByName.get(price.productName) as ProductItem,
    volume: volume[price.volumeId],
  }
}

export function getOrderItem(
  orders: ReadonlyArray<OrderItem>,
  prices: Map<string, PriceItem>,
  products: Map<string, ProductItem>,
  volume: Volume,
): ReadonlyArray<OrderItemContainer> {
  return orders
    .map(o => (priceAdapter(o, prices, products, volume )))
}

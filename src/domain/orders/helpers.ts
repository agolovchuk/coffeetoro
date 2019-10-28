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
  orders: Record<string, OrderItem>,
  prices: Map<string, PriceItem>,
  products: Map<string, ProductItem>,
  volume: Volume,
): ReadonlyArray<OrderItemContainer> {
  return Object.values(orders)
    .map(o => (priceAdapter(o, prices, products, volume )))
}

type OrderState = Record<string, OrderItem>;

export function mergeOrder(state: OrderState, order: OrderItem): OrderState {
  const id = order.priceId
  if (id in state) {
    return {
      ...state,
      [id]: {
        ...order,
        quantity: state[id].quantity + order.quantity,
      },
    };
  }
  return { ...state, [id]: order };
}

export function updateOrder(state: OrderState, order: OrderItem): OrderState {
  return {
    ...state,
    [order.priceId]: order,
  }
}

export function updateOrderItem(state: OrderState, prevId: string, nextId: string): OrderState {
  const { [prevId]: order, ...rest } = state;
  return {
    ...rest,
    [nextId]: {
      ...order,
      priceId: nextId,
    }
  }
}

export function removeOrderItem(state: OrderState, priceId: string): OrderState {
  const { [priceId]: order, ...rest } = state;
  return rest;
}
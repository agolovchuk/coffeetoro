import { ProductItem, VolumeItem } from '../dictionary';
import { PriceItem } from '../dictionary/Types';

export interface OrderItem {
  id: string,
  priceId: string,
  quantity: number,
}

enum Payment {
  Cache,
  Cards,
}

enum Status {
  Opened,
  Archive,
}

interface OrderListItem {
  id: string,
  date: string,
  status: Status,
  client: string,
  payment: Payment,
}

export interface OrderItemContainer {
  quantity: number,
  price: PriceItem,
  product: ProductItem,
  volume: VolumeItem,
}

export interface OrderState {
  order: Record<string, OrderItem>;
  orderList: ReadonlyArray<OrderListItem>;
}
import { ProductItem, VolumeItem } from '../dictionary';
import { PriceItem } from '../dictionary/Types';

export enum Payment {
  Opened,
  Cache,
  Bank,
}

export enum Status {
  Opened,
  Archive,
}

export interface OrderItem {
  readonly orderId: string,
  readonly priceId: string;
  readonly quantity: number;
}

export interface Order {
  readonly id: string;
  readonly date: string;
  readonly client: string;
  readonly payment: Payment;
  readonly owner: string;
}

export interface OrderItemContainer {
  quantity: number,
  price: PriceItem,
  product: ProductItem,
  volume: VolumeItem,
}

export interface OrderState {
  orderItems: Record<string, OrderItem>;
  ordersList: Record<string, Order>;
}

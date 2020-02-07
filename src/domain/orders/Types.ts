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

export interface IOrderItem {
  readonly orderId: string,
  readonly priceId: string,
  readonly quantity: number,
}

export interface OrderItem {
  readonly priceId: string;
  readonly quantity: number;
}

export interface Order {
  readonly id: string;
  readonly date: string;
  readonly client: string;
  readonly payment: Payment;
  readonly items: Record<string, OrderItem>;
}

export interface OrderItemContainer {
  quantity: number,
  price: PriceItem,
  product: ProductItem,
  volume: VolumeItem,
}

export interface OrderState {
  ordersList: Record<string, Order>;
}

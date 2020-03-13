import { TypeOf } from 'io-ts';
import { order, orderItem } from './contracts';
import { PriceItem, CategoryItem, VolumeItem, Prices, Categories } from '../dictionary/Types';

export interface OrderDictionary {
  categories: Categories;
  prices: Prices;
}

export enum PaymentMethod {
  Opened,
  Cash,
  Bank,
}

export enum Status {
  Opened,
  Archive,
}

export type OrderItem = TypeOf<typeof orderItem>;

export type Order = TypeOf<typeof order>;

export interface OrderItemContainer {
  quantity: number,
  price: PriceItem,
  category: CategoryItem,
  volume: VolumeItem,
}

export interface OrderState {
  readonly orderItems: Record<string, OrderItem>;
  readonly ordersList: Record<string, Order>;
  readonly orderDictionary: OrderDictionary;
}

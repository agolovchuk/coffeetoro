import { TypeOf } from 'io-ts';
import { order, orderItem } from './contracts';
import { PriceItem, PriceExtendet, TMCItem, ProcessCardItem } from '../dictionary/Types';

export interface OrderDictionary {
  prices: Record<string, PriceItem>;
  articles: Record<string, TMCItem>;
  processCards: Record<string, ProcessCardItem>;
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
  price: PriceExtendet,
}

export interface OrderState {
  readonly orderItems: Record<string, OrderItem>;
  readonly ordersList: Record<string, Order>;
  readonly orderDictionary: OrderDictionary;
}

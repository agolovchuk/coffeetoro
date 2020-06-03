import { TypeOf } from 'io-ts';
import { order, orderItem, discountItem } from './contracts';
import { PriceItem, PriceExtended, TMCItem, ProcessCardItem } from '../dictionary/Types';

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
export type DiscountItem = TypeOf<typeof discountItem>;

export type Order = TypeOf<typeof order>;

export interface OrderItemContainer {
  quantity: number,
  price: PriceExtended,
}

export interface OrderState {
  readonly orderItems: Record<string, OrderItem>;
  readonly discountItems: Record<string, DiscountItem>;
  readonly ordersList: Record<string, Order & {count: number}>;
  readonly orderDictionary: OrderDictionary;
}

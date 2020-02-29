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

export interface OrderItem {
  readonly orderId: string,
  readonly priceId: string;
  readonly quantity: number;
}

export interface Order {
  readonly id: string;
  readonly date: string;
  readonly client: string;
  readonly payment: PaymentMethod;
  readonly owner: string;
}

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

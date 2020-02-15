import { Order, OrderItem } from 'domain/orders/Types';
import { validateOrder, validateOrderItem } from 'domain/orders/contracts';

type Validator<T> = (value: unknown) => T; 

type DictionaryAdapter<T> = (prev: Record<string, T> | null, value: unknown) => Record<string, T>;

export function dictionaryAdapter<T extends Record<K, any>, K extends keyof T>(validator: Validator<T>, field: K): DictionaryAdapter<T> {
  return (prev: Record<string, T> | null, value: unknown) => {
    try {
      const item = validator(value);
      return Object.assign({}, prev || {}, { [item[field]]: item });
    } catch (err) {
      return prev || {};
    }
  }
}

export const orderAdapter: DictionaryAdapter<Order> = dictionaryAdapter(validateOrder, 'id');
export const orderItemAdapter: DictionaryAdapter<OrderItem> = dictionaryAdapter(validateOrderItem, 'priceId');

export function oneOrderAdapter(value: unknown): Order | null  {
  try {
    return validateOrder(value);
  } catch (err) {
    return null;
  }
}

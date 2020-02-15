import { Order, OrderItem } from 'domain/orders/Types';
import { validateOrder, validateOrderItem } from 'domain/orders/contracts';

type Validator<T> = (value: unknown) => T; 

type DictionaryAdapter<T> = (prev: Record<string, T> | null, value: unknown) => Record<string, T>;

export function dictionaryAdapter<T extends Record<K, any>, K extends keyof T>(validator: Validator<T>, field: K): DictionaryAdapter<T> {
  return (prev: Record<string, T> | null, value: unknown) => {
    const item = validator(value);
    return Object.assign({}, prev || {}, { [item[field]]: item });
  }
}

export const orderAdapter: DictionaryAdapter<Order> = dictionaryAdapter(validateOrder, 'id');
export const orderItemAdapter: DictionaryAdapter<OrderItem> = dictionaryAdapter(validateOrderItem, 'priceId');

export { validateOrder };
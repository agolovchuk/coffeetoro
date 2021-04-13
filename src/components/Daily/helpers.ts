import currency from 'currency.js';
import { IOrder, IAccountItem } from './Types';

export const FORMAT = 'yyyy-MM-dd';

export function orderSum(order: IOrder, start: number) {
  const discount = (order?.discounts || []).reduce((a, v) => a.add(currency(v.valuation)), currency(0));
  return (order.items || [])
    .reduce((a, v) => a.add(currency(v.valuation).multiply(v.quantity)), currency(start).subtract(discount)).value;
}

export function accountsSummary(orders: ReadonlyArray<IOrder>, accounts: Record<string, IAccountItem>): ReadonlyArray<IAccountItem & { value: number }> {
  const ac = orders.reduce((a, v) => ({
    ...a,
    [v.payment]: orderSum(v, (a[v.payment] || 0)),
  }), {} as Record<string, number>);
  return Object.entries(ac).map(([key, value]) => ({
  // @ts-ignore
      id: key,
      ...accounts[key],
      value,
    })
  );
}

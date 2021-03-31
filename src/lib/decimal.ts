import currency from 'currency.js';
import get from "lodash/get";

export function summa<T extends { valuation: number, quantity?: number }>(list: ReadonlyArray<T>): number {
  return list.reduce((a, v) => a.add(
    currency(v.valuation).multiply(get(v, 'quantity', 1))
  ), currency(0)).value;
}

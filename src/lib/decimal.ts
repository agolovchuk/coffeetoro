import Decimal from "decimal.js-light";
import get from "lodash/get";

export function summa<T extends { valuation: number, quantity?: number }>(list: ReadonlyArray<T>): number {
  return list.reduce((a, v) => a.plus(
    new Decimal(v.valuation).times(get(v, 'quantity', 1))
  ), new Decimal(0)).toNumber();
}

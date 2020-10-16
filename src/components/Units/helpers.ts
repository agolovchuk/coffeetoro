import * as React from 'react';
import { APPStore } from './Types';

export function getPrice(multiplier: number) {
  return (value: number | string): number => {
    if (typeof value === 'number') {
      return value / multiplier;
    }
    if (value.trim() === '') return 0;
    return parse(value) / multiplier;
  }
}

function parse(value: string): number {
  const v = parseFloat(value);
  if (isNaN(v)) throw new TypeError('Invalid value');
  return v;
}

function toInnerMoney(value: string, multiplier: number) {
  if (value.trim() === '') return '';
  return (parse(value) * multiplier).toString();
}

export function getValueFromStore(store: APPStore) {
  const { multiplier, currency } = store.getState().env;
  return {
    getPrice: getPrice(multiplier),
    currency,
    multiplier,
    toInnerMoney: (value: string) => toInnerMoney(value, multiplier),
  }
}

const DEFAULT_MULTIPLIER = 1000;

export default  React.createContext({
  getPrice: getPrice(DEFAULT_MULTIPLIER),
  currency: 'UAH',
  multiplier: DEFAULT_MULTIPLIER,
  toInnerMoney: (value: string) => (parse(value) * DEFAULT_MULTIPLIER).toFixed(2),
});

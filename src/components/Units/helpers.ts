import * as React from 'react';
import { APPStore } from './Types';

export function getPrice(multiplier: number) {
  return (value: number) => value / multiplier;
}

export function getValueFromStore(store: APPStore) {
  const { multiplier, currency } = store.getState().env;
  return {
    getPrice: getPrice(multiplier),
    currency,
    toInnerMoney: (value: number) => value * multiplier,
  }
}

const DEFAULT_MULTIPLIER = 1000;

export default  React.createContext({
  getPrice: getPrice(DEFAULT_MULTIPLIER),
  currency: 'UAH',
  toInnerMoney: (value: number) => value * DEFAULT_MULTIPLIER,
});

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
  }
}

export default  React.createContext({
  getPrice: getPrice(1000),
  currency: 'UAH'
});

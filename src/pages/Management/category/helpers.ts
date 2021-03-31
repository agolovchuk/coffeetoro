import pick from 'lodash/pick';
import update from 'lodash/fp/update';
import compose from 'lodash/fp/compose';
import Decimal from "decimal.js-light";
import { PriceBase, PricePC, PriceTMC } from "domain/dictionary";
import { getParent } from 'modules/tree/helpers';

import { EitherEdit } from "../Types";

interface Item {
  id: string;
  count: number;
  title: string;
  parentId: string;
}

export function getParents<T extends Item>(list: T[]) {
  const group = list.reduce((a, v) => ({...a, [v.id]: v}), {} as Record<string, T>);
  return ({ id }: T): string => {
    const l: string[] = [];
    getParent(id, group, l);
    return l.join('.');
  }
}

export function cleanPrice(price: any): PriceTMC | PricePC {
  const base = pick(price, ['id', 'parentId', 'add', 'expiry', 'valuation', 'sortIndex', 'quantity', 'step']);
  if (price.type === 'tmc') {
    return {
      ...base,
      type: 'tmc',
      barcode: price.barcode,
    }
  }
  if (price.type === 'pc') {
    return {
      ...base,
      type: 'pc',
      refId: price.refId,
    }
  }
  throw new TypeError('Incorrect price item');
}

export function priceFormAdapter(price: EitherEdit<PriceBase>): EitherEdit<PriceBase> {
  return compose(
    update('valuation')(v => new Decimal(v).dividedBy(1000).toNumber()),
    update('step')(v => typeof v === 'undefined' ? 1 : v),
  )(price);
}

export function priceSubmitAdapter<T extends PriceBase>(price: T): T {
  return update('valuation')(v => new Decimal(v).times(1000).toNumber())(price);
}

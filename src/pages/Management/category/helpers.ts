import { PricePC, PriceTMC } from "domain/dictionary";
import { getChildren, getParent } from '../components/tree/helpers';
import pick from 'lodash/pick';

interface Item {
  id: string;
  count: number;
  title: string;
  parentId: string;
}

export function getParentsList<T extends Item>(list: ReadonlyArray<T>, group: Record<string, T[]>) {
  const l = list.filter(f => f.count === 0);
  return (current: string) => {
    const children = getChildren(current, group);
    return [
      { name: 'root', title: '(коневой уровень)'},
      ...l.filter(f => !children.includes(f.id))
        .map(({ id, title }) => ({ name: id, title })),
    ];
  }
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
  const base = pick(price, ['id', 'parentId', 'add', 'expiry', 'valuation', 'sortIndex']);
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

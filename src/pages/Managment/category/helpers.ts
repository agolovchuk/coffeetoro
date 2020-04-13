import { getChildrend, getParent } from '../components/tree/helpers';

interface Item {
  id: string;
  count: number;
  title: string;
  parentId: string;
}

export function getPrentsList<T extends Item>(list: ReadonlyArray<T>, group: Record<string, T[]>) {
  const l = list.filter(f => f.count === 0);
  return (current: string) => {
    const children = getChildrend(current, group);
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
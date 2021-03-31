import { CategoryItem } from 'domain/dictionary';
import { ISelectItem } from 'components/Form/Types'
import {getChildren, getParent} from "../tree/helpers";

interface Item {
  id: string;
  title: string;
  parentId: string;
}

export function categoriesList(categories: ReadonlyArray<CategoryItem>): ReadonlyArray<ISelectItem> {
  const root: ISelectItem = { name: '', title: '(корневой уровень)', disabled: true };
  return categories
    .map(({ id, title }) => ({ name: id, title }))
    .concat([root])
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getParents<T extends Item>(list: T[]) {
  const group = list.reduce((a, v) => ({...a, [v.id]: v}), {} as Record<string, T>);
  return ({ id }: T): string => {
    const l: string[] = [];
    getParent(id, group, l);
    return l.join('.');
  }
}

export function getParentsList<T extends Item>(list: ReadonlyArray<T>, group: Record<string, T[]>, groupName: string = 'root') {
  return (current: string) => {
    const children = getChildren(current, group);
    return [
      { name: groupName, title: '(корневой уровень)'},
      ...list.filter(f => !children.includes(f.id))
        .map(({ id, title }) => ({ name: id, title })),
    ];
  }
}

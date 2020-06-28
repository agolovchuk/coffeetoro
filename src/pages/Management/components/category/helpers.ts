import { CategoryItem } from 'domain/dictionary';
import { ISelectItem } from 'components/Form/Types'
import { getChildren } from "../tree/helpers";

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

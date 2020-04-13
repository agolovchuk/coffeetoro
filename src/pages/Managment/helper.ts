import pick from 'lodash/fp/pick';
import compact from 'lodash/fp/compact';

interface SortableDict {
  sortIndex: number;
}

export function getMax<T extends SortableDict>(l: ReadonlyArray<T>) {
  return l.reduce((a, v) => Math.max(a, v.sortIndex), 0);
}

export function getLink(url: string, name: string) {
  return [url, name].join('/');
}

interface TitleContainer {
  title: string;
  description?: string;
}

export function getTitle(price: TitleContainer): string {
  const { title, description } = pick(['title', 'description'])(price)
  return compact([title, description]).join(' / ');
}

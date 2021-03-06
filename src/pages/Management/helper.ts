import pick from 'lodash/fp/pick';
import get from "lodash/get";
import compact from 'lodash/fp/compact';
import { TMCItem, UnitItem } from "domain/dictionary";

interface SortableDict {
  sortIndex: number;
}

export function getMax<T extends SortableDict>(l: ReadonlyArray<T>) {
  return l.reduce((a, v) => Math.max(a, v.sortIndex), 0);
}

export function getLink(url: string, name: string) {
  return [url, name].join('/');
}

export interface TitleContainer {
  title: string;
  description?: string;
  unit?: {
    title: string
  }
}

export function getTitle<T extends TitleContainer>(price: T): string {
  const { title, description } = pick(['title', 'description'])(price);
  const unitTitle = get(price, ['unit', 'title']);
  return compact([title, description, unitTitle]).join(' / ');
}

export function getUnitsTitle(units: Record<string, UnitItem>, article: TMCItem) {
  return get(units, [get(article, 'unitId'), 'title']);
}

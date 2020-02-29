interface SortableDict {
  sortIndex: number;
}

export function getMax<T extends SortableDict>(l: ReadonlyArray<T>) {
  return l.reduce((a, v) => Math.max(a, v.sortIndex), 0);
}

export function getLink(url: string, name: string) {
  return [url, name].join('/');
}

interface SelectOption {
  name: string;
  title: string;
}

export function getPrentsList<T extends SelectOption>(current: string, list: ReadonlyArray<T>) {
  return [{ name: 'root', title: '-----'}, ...list.filter(f => f.name !== current)];
}
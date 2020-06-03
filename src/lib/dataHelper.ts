export function arrayToRecord<T extends Record<K, any>, K extends keyof T>(arr: ReadonlyArray<T>, field: K): Record<K, T> {
  return arr.reduce((a, v) => ({ ...a, [v[field]]: v }), {} as T);
}

export function toArray<T>(obj: Record<string, T>): ReadonlyArray<T> {
  return Object.values(obj);
}

export function groupBy<T, K extends keyof T>(arr: ReadonlyArray<T>, field: K): Map<K, ReadonlyArray<T>> {
  return arr.reduce((a, v) => {
    const g = a.get(v[field]) || [];
    return a.set(v[field], g.concat(v));
  }, new Map());
}

export function arrayMerge<T>(arr: ReadonlyArray<T>, item: T): ReadonlyArray<T> {
  return arr.concat([item]);
}

function objectHash<T extends object>(o: T, delimiter: string = '@'): string {
  return Object.keys(o).join(delimiter);
}

export class ObjectMap<K extends object, V> extends Map {
  constructor(hashFunction: (o: K) => string = objectHash) {
    super();
    this.hash = hashFunction;
  }

  private hash: (o: K) => string;

  set(o: K, value: V) {
    super.set(this.hash(o), value);
    return this;
  }

  get(o: K) {
    return super.get(this.hash(o));
  }

  has(o: K) {
    return super.has(this.hash(o));
  }

  delete(o: K) {
    return super.delete(this.hash(o));
  }

}

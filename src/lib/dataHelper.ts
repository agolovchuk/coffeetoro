export function arrayToRecord<T extends Record<K, any>, K extends keyof T>(arr: ReadonlyArray<T>, field: K): Record<K, T> {
  return arr.reduce((a, v) => ({ ...a, [v[field]]: v }), {} as T);
}

export function toArray<T>(obj: Record<string, T>): ReadonlyArray<T> {
  return Object.values(obj);
}

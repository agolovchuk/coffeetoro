export function sortByDate<T extends Record<K, string>, K extends keyof T>(field: K) {
  const getTime = (t: string) => new Date(t).getTime();
  return (a: T, b: T) => getTime(a[field]) - getTime(b[field]);
}

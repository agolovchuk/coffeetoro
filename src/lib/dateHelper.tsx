export function sortByDate<T extends Record<K, Date>, K extends keyof T>(field: K) {
  const getTime = (t: Date) => t.getTime();
  return (a: T, b: T) => getTime(a[field]) - getTime(b[field]);
}

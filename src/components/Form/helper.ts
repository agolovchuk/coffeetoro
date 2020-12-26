export function formatToNumber(value: string | undefined): number | undefined {
  if (typeof value === 'undefined') return undefined;
  const v = parseInt(value, 10);
  return isNaN(v) ? undefined : v;
}

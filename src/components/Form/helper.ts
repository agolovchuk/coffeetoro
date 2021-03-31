export function formatToInt(value: string | undefined): number | undefined {
  if (typeof value === 'undefined') return undefined;
  const v = parseInt(value, 10);
  return isNaN(v) ? undefined : v;
}

export function formatToFloat(value: string | undefined): number | undefined {
  if (typeof value === 'undefined') return undefined;
  const v = parseFloat(value.toString().replace(',', '.'));
  return isNaN(v) ? undefined : v;
}

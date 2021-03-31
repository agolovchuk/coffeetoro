type Rules<T = any> = (value: T) => string | undefined;

const isNaNCheck = (value: number) => isNaN(value) ? 'NaN' : undefined;

export const isRequired: Rules = value => (value ? undefined : 'Required');

export const isPositive: Rules = value => parseFloat(value) > 0 ? undefined : 'Should be positive';

export const isInt: Rules<string | number | undefined> = value => {
  if (typeof value === 'undefined') return undefined;
  if (typeof value === 'number') return isNaNCheck(value);

  const v = parseInt(value, 10);
  if (isNaN(v)) return 'NaN';
  if (v.toString().length !== value.length) return 'NaN';

  return undefined;
}

export const isFloat: Rules<string | number | undefined> = value => {
  if (typeof value === 'undefined') return undefined;
  if (typeof value === 'number') return isNaNCheck(value);

  if(!/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value)) return 'incorrect pattern'

  return undefined;
}

export function rulesCompose(...rules: ReadonlyArray<Rules>): Rules {
  return value => {
    for (let i=0; i < rules.length; i++) {
      const res = rules[i](value);
      if (typeof res !== 'undefined') return res;
    }
    return undefined;
  }
}

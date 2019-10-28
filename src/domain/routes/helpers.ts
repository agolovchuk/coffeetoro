import { PARAMS_LIST } from './constatnts';
import { ParamsNames, Params } from './Types';

export function currentParams(list: ReadonlyArray<ParamsNames>, params: Params): ReadonlyArray<string> {
  return list.reduce((a: ReadonlyArray<string>, v) => {
    const value = params[v];
    return value ? a.concat(value) : a;
  }, []);
}

export function currentParamsName(list: ReadonlyArray<ParamsNames>, params: Params): ReadonlyArray<ParamsNames> {
  return list.reduce((a: ReadonlyArray<ParamsNames>, v) => params[v] ? a.concat(v) : a, []);
}

export function lastParams(list: ReadonlyArray<ParamsNames>, params: Params) {
  const names = currentParamsName(list, params);
  return params[names[names.length - 1]];
}

export const lastParamsValue = (params: Params) => lastParams(PARAMS_LIST, params);
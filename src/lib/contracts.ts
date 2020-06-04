import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';

export function valueOrThrow<A, O, I>(codec: t.Type<A, O, I>, value: I): A {
  return pipe(
    codec.decode(value),
    fold((err) => {
      throw err;
    }, identity)
  );
}

export type DAFactory<T> = (prev: T | null, value: unknown) => T | null;

export function dictionaryAdapterFactory<
  T extends Record<K, V>,
  F extends keyof V,
  V extends Record<F, any>,
  K extends keyof T
>(typeContainer: t.Type<V>, field: F): DAFactory<T> {
  return (prev: T | null, value: unknown) => {
    try {
      const item = valueOrThrow(typeContainer, value);
      return Object.assign(({} as T), prev || {}, { [item[field]]: item });
    } catch (err) {
      console.warn(err)
      return prev;
    }
  }
}

export function validateArray<T>(adapter: DAFactory<T>): (list: null | unknown[]) => T {
  return (list: null | unknown[]): T => (list || [])
    .reduce((a: T, v) => (adapter(a, v) || a), {} as T)
}

export function validate<A, O, I>(contract: t.Type<A, O, I>, v: I): A | null {
  try {
    return valueOrThrow(contract, v)
  } catch (err) {
    return null;
  }
}

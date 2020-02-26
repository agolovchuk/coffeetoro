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

import * as t from 'typed-contracts';

export type Validator<T> = (value: unknown) => t.ValidationError | T
type StrictValidator<T> = (value: unknown) => T;

export function validate<T>(validator: Validator<T>): StrictValidator<T> {
  return (value: unknown) => {
    const validationResult = validator(value);
    if (validationResult instanceof t.ValidationError) {
      throw validationResult;
    }
    return (validationResult as T);
  };
}

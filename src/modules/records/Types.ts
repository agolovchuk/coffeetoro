export type EitherEdit<T> = T & { isEdit?: boolean };

export interface IUseRecords<T> {
  update?(d: T, cb?: () => void): void,
  create?(d: T, cb?: () => void): void,
  name: string;
}

export type TEditAdapter<T> = (d: T) => EitherEdit<T>;

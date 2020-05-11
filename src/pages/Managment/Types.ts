
export type EitherEdit<T> = T & { isEdit?: boolean };

export interface Item {
  name: string;
  title: string;
}
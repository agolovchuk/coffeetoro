export type Mode = "readonly" | "readwrite" | "versionchange" | undefined;

export interface Fixtures {
  table: string;
  data: ReadonlyArray<any>;
}

export type RequestUpgrade = (this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => ReadonlyArray<Fixtures>;

export type DataAdapterFactory<T> = (prev: T | null, value: unknown) => T | null;

export type Validator<T> = (value: unknown) => T | null;

export type Query = string | number | IDBArrayKey;

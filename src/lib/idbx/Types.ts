export type Mode = "readonly" | "readwrite" | "versionchange" | undefined;

export interface Fixtures {
  table: string;
  data: ReadonlyArray<any>;
}

export type RequestUpgrade = (this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => ReadonlyArray<Fixtures>;

export type DictionaryAdapter<T> = (prev: Record<string, T> | null, value: unknown) => Record<string, T>;

export type Adapter<T> = (value: unknown) => T | null;

export type Query = string | number | IDBArrayKey;
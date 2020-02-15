import get from 'lodash/get';
export const READ_WRITE = 'readwrite';
export const READ_ONLY = 'readonly';

type RequestUpgrade = (this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any;

type DictionaryAdapter<T> = (prev: Record<string, T> | null, value: unknown) => Record<string, T>;

type Adapter<T> = (value: unknown) => T | null;

type Query = string | number | IDBArrayKey;

export default class IDB {

  private readonly name: string;
  private readonly version: number | undefined;
  private requestUpgrade: RequestUpgrade | null;

  constructor(name: string, requestUpgrade: RequestUpgrade | null, version?: number) {
    this.name = name;
    this.version = version;
    this.requestUpgrade = requestUpgrade;
  }

  open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.name, this.version);
      request.onupgradeneeded = this.requestUpgrade;
      request.onerror = function requestFailure() {
        reject(this.error);
      }
      request.onsuccess = function requestSuccess() {
        resolve(this.result);
      }
    });
  }

  async getDictionary<T>(
    table: string,
    indexName: string,
    query: string | number,
    adapter: DictionaryAdapter<T>,
  ): Promise<Record<string, T> | null> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      let result: Record<string, T> | null = null;
      const request = db.transaction([table], READ_ONLY).objectStore(table).index(indexName).openCursor(query);
      request.onsuccess = (event) => {
        const cursor = get(event, ['target', 'result']);
        if (cursor) {
          result = adapter(result, cursor.value);
          cursor.continue();
        }
        else {
          db.close();
          resolve(result);
        }
      };
      request.onerror = () => { db.close(); reject(); };
    });
  }

  async addItem(table: string, value: any): Promise<void> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      const request = db.transaction([table], READ_WRITE).objectStore(table).add(value);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(); };
    });
  }

  async getItem<T>(table: string, query: Query, adapter: Adapter<T>): Promise<T | null> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      const request = db.transaction([table], READ_ONLY).objectStore(table).get(query);
      request.onsuccess = (event) => {
        db.close();
        resolve(adapter(get(event, ['target', 'result'])));
      };
      request.onerror = () => { db.close(); reject(); };
    });
  }

  async deleteItem(table: string, query: Query): Promise<void> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      const request = db.transaction([table], READ_WRITE).objectStore(table).delete(query);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(); };
    });
  }

  async updateItem(table: string, value: any): Promise<void> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      const request = db.transaction([table], READ_WRITE).objectStore(table).put(value);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(); };
    });
  }

}
import get from 'lodash/get';
import {
  RequestUpgrade,
  Fixtures,
  DataAdapterFactory,
  Query,
  Validator,
  Mode,
} from './Types';
import * as C from './constant';
import { applyFixtures } from './helpers';

export default class IDB {

  private readonly name: string;
  private readonly version: number | undefined;
  private requestUpgrade: RequestUpgrade | null;
  private db: IDBDatabase | null;

  constructor(name: string, requestUpgrade: RequestUpgrade | null, version?: number) {
    this.name = name;
    this.version = version;
    this.requestUpgrade = requestUpgrade;
    this.db = null;
  }

  protected async os(table: string | string[], mode: Mode): Promise<IDBObjectStore> {
    this.db = await this.open();
    const osName = Array.isArray(table) ? table[0] : table;
    return this.db.transaction(table, mode).objectStore(osName);
  }

  protected async reques<T>(req: IDBRequest<T>, cb: () => void = this.close): Promise<T> {
    return new Promise((resolve, reject) => {
      req.onsuccess = function() { cb(); resolve(this.result); }
      req.onerror = function() { cb(); reject(this.error); }
    });
  }

  protected close = () => {
    if (this.db) this.db.close();
    this.db = null;
  }

  open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.name, this.version);
      const _requestUpgrade = this.requestUpgrade;
      let fixtures: ReadonlyArray<Fixtures> | undefined;
      request.onupgradeneeded = function upgrade(event) {
        if (typeof _requestUpgrade === 'function') {
          fixtures = _requestUpgrade.call(this, event);
        }
      }
      request.onerror = function requestFailure() {
        reject(this.error);
      }
      request.onsuccess = function requestSuccess() {
        if (fixtures) {
          applyFixtures.call(this.result, fixtures).then(() => { resolve(this.result); })
        } else {
          resolve(this.result);
        }
      }
    });
  }

  async getDictionary<T>(
    table: string,
    adapter: DataAdapterFactory<T>,
    indexName: string,
    query?: Query,
  ): Promise<T | null> {
    const objectStore = await this.os(table, C.READ_ONLY);
    return await new Promise((resolve, reject) => {
      let result: T | null = null;
      const request = objectStore.index(indexName).openCursor(query);
      request.onsuccess = (event) => {
        const cursor = get(event, ['target', 'result']);
        if (cursor) {
          result = adapter(result, cursor.value);
          cursor.continue();
        }
        else {
          this.close();
          resolve(result);
        }
      };
      request.onerror = () => { this.close(); reject(); };
    });
  }

  async addItem(table: string, value: any): Promise<void> {
    try {
      const objectStore = await this.os(table, C.READ_WRITE);
      await this.reques(objectStore.add(value));
    } catch (err) {
      console.warn(err);
    }
  }

  async getItem<T>(table: string, validator: Validator<T>, query: Query, indexName?: string): Promise<T | null> {
    const objectStore = await this.os(table, C.READ_ONLY);
    return await new Promise((resolve, reject) => {
      const request = indexName ? objectStore.index(indexName).get(query) : objectStore.get(query);
      request.onsuccess = (event) => {
        this.close();
        resolve(validator(get(event, ['target', 'result'])));
      };
      request.onerror = () => { this.close(); reject(); };
    });
  }

  async getAll<T>(table: string, adapter: (res: null | unknown[] ) => T, indexName?: string, query?: Query | null): Promise<T | null> {
    const objectStore = await this.os(table, C.READ_ONLY);
    return await new Promise((resolve, reject) => {
      const request = typeof indexName === 'string' ? objectStore.index(indexName).getAll(query) : objectStore.getAll(query);
      request.onsuccess = (event) => {
        this.close();
        resolve(adapter(get(event, ['target', 'result'])));
      };
      request.onerror = () => { this.close(); reject(); };
    });
  }

  async deleteItem(table: string, query: Query): Promise<void> {
    try {
      const objectStore = await this.os(table, C.READ_WRITE);
      await this.reques(objectStore.delete(query));
    } catch (err) {
      console.warn(err);
    }
  }

  async updateItem(table: string, value: any): Promise<void> {
    try {
      const objectStore = await this.os(table, C.READ_WRITE);
      await this.reques(objectStore.put(value));
    } catch (err) {
      console.warn(err);
    }
  }

}

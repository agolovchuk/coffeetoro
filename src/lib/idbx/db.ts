import get from 'lodash/get';
import {
  RequestUpgrade,
  Fixtures,
  DictionaryAdapter,
  Query,
  Adapter
} from './Types';
import * as C from './constant';
import { applyFixtures, os } from './helpers';

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
    indexName: string,
    query: string | number,
    adapter: DictionaryAdapter<T>,
  ): Promise<Record<string, T> | null> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      let result: Record<string, T> | null = null;
      const request = os.call(db, table, C.READ_ONLY).index(indexName).openCursor(query);
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
      const request = os.call(db, table, C.READ_WRITE).add(value);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(); };
    });
  }

  async getItem<T>(table: string, indexName: string, query: Query, adapter: Adapter<T>): Promise<T | null> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      const request = os.call(db, table, C.READ_ONLY).index(indexName).get(query);
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
      const request = os.call(db, table, C.READ_WRITE).delete(query);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(); };
    });
  }

  async updateItem(table: string, value: any): Promise<void> {
    const db = await this.open();
    return await new Promise((resolve, reject) => {
      const request = os.call(db, table, C.READ_WRITE).put(value);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(); };
    });
  }

}
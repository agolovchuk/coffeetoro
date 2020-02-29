import * as C from './constant';
import { Mode, Fixtures } from './Types';

export function applyFixtures(this: IDBDatabase, fx: ReadonlyArray<Fixtures>): Promise<void[]> {
  return Promise.all(fx.map(e => addList(os.call(this, e.table, C.READ_WRITE), e.data)));
}

export function os(this: IDBDatabase, table: string | string[], mode: Mode): IDBObjectStore {
  const osName = Array.isArray(table) ? table[0] : table;
  return this.transaction(table, mode).objectStore(osName);
}

export function addList<T>(os: IDBObjectStore, list: ReadonlyArray<T>): Promise<void> {
  return new Promise((resolve, reject) => {
    const addItem = (item: T, index: number = 0) => {
      const req = os.add(item);
      req.onsuccess = () => {
        const i = index + 1;
        if (list.length > i) {
          addItem(list[i], i);
        } else {
          resolve();
        }
      }
      req.onerror = (err) => { reject(err) }
    }
    addItem(list[0]);
  })
}

export function promisifyReques<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = function() {
      resolve(this.result);
    }
    req.onerror = function() {
      reject(this.error);
    }
  });
}
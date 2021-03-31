import { Mode, Fixtures, ICursorOption, EMode } from './Types';
import get from "lodash/get";

export function applyFixtures(this: IDBDatabase, fx: ReadonlyArray<Fixtures>): Promise<void[]> {
  return Promise.all(fx.map(e => addList(os.call(this, e.table, EMode.READWRITE), e.data)));
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

export function promisifyRequest<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = function() {
      resolve(this.result);
    }
    req.onerror = function() {
      reject(this.error);
    }
  });
}

export function promisifyCursor<T>(
  os: IDBObjectStore | IDBIndex,
  query: IDBValidKey | IDBKeyRange | null,
  option?: ICursorOption<T>,
  ): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const result: T[] = [];
    const request = os.openCursor(query, option?.direction);
    const adapter = typeof option?.adapter === 'function' ? option.adapter : (d: T) => d;
    const isFinish = typeof option?.isFinish === 'function' ? option.isFinish : () => false;
    request.onsuccess = (event) => {
      const cursor = get(event, ['target', 'result']);
      if (cursor) {
        const d = adapter(cursor.value);
        result.push(d);
        if (isFinish(d, result)) {
          resolve(result);
          return;
        }
        cursor.continue();
      }
      else {
        resolve(result);
      }
    }
    request.onerror = () => { reject(); };
  });
}

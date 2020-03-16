import { Dispatch, Action } from 'redux';
import eq from 'lodash/eq';
import CDB from 'db';
import * as C from 'db/constants';
import { priceAdapter, categoryAdapter } from 'domain/dictionary/adapters'

export function addPriceHandler<A extends Action>(dispatch: Dispatch<A>) {
  const dbx = new CDB();
  return async(s: firebase.database.DataSnapshot) => {
    try {
      if (typeof s.key === 'string') {
        const data = s.val();
        const p = await dbx.getItem(C.TABLE.price.name, priceAdapter, s.key);
        if (p === null) {
          await dbx.addItem(C.TABLE.price.name, {...data, fromDate: new Date() });
        }
      } 
    } catch (err) {
      console.warn(err);
    }
  }
}

export function changePriceHandler<A extends Action>(dispatch: Dispatch<A>) {
  const dbx = new CDB();
  return async(s: firebase.database.DataSnapshot) => {
    try {
      if (typeof s.key === 'string') {
        const data = s.val();
        const p = await dbx.getItem(C.TABLE.price.name, priceAdapter, s.key);
        if (p !== null) {
          const { fromDate, ...dbp } = p;
          if (eq({ ...dbp, fromDate: fromDate.toISOString() }, data)) {
            return;
          }
        }
        await dbx.updateItem(C.TABLE.price.name, {...data, fromDate: new Date() });
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export function addCategoryHandler<A extends Action>(dispatch: Dispatch<A>) {
  const dbx = new CDB();
  return async(s: firebase.database.DataSnapshot) => {
    try {
      if (typeof s.key === 'string') {
        const data = s.val();
        const p = await dbx.getItem(C.TABLE.category.name, categoryAdapter, s.key);
        if (p === null) {
          await dbx.addItem(C.TABLE.category.name, data);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export function changeCategoryHandler<A extends Action>(dispatch: Dispatch<A>) {
  const dbx = new CDB();
  return async(s: firebase.database.DataSnapshot) => {
    try {
      if (typeof s.key === 'string') {
        const data = s.val();
        const p = await dbx.getItem(C.TABLE.category.name, categoryAdapter, s.key);
        if (p !== null && eq(p, data)) return;
        await dbx.updateItem(C.TABLE.price.name, data);
      }
    } catch (err) {
      console.warn(err);
    }
  }
}
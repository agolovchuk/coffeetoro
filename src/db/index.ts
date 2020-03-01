import { IDB } from '../lib/idbx';
import { DB_NAME } from './constants';
export * from '../lib/idbx';

export default class CDB extends IDB {
  constructor() {
    super(DB_NAME, null);
  }
}

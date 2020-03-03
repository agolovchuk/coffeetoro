import { IDB } from '../lib/idbx';
import { DB_NAME } from './constants';
import requestUpgrade from './migration';
export * from '../lib/idbx';

export default class CDB extends IDB {
  constructor() {
    super(DB_NAME, requestUpgrade);
  }
}

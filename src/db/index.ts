import { IDB } from '../lib/idbx';
export * from '../lib/idbx';

export default class CDB extends IDB {
  constructor() {
    super('cachebox', null);
  }
}

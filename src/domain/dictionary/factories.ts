import { getId } from 'lib/id';
import { ACCOUNT_ID_LENGTH } from './constants';
import { IAccountItem } from './Types';

export function accountFactory(): IAccountItem {
  return {
    id: getId(ACCOUNT_ID_LENGTH),
    name: '',
  }
}

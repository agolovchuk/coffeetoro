import { nanoid } from 'nanoid';
import compact from 'lodash/fp/compact';

export function getId(size: number, prefix?: string) {
  return compact([prefix, nanoid(size)]).join('-');
}
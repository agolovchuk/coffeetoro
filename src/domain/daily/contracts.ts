import * as t from 'io-ts';
import { date } from 'io-ts-types/lib/date';

export const dayItem = t.interface({
  date: date,
  dateKey: t.string,
  cash: t.number,
});

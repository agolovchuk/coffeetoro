import * as t from 'io-ts';
import { date } from 'io-ts-types/lib/date';

export const dayItem = t.interface({
  date: date,
  dateKey: t.string,
  cash: t.number,
  bank: t.union([t.number, t.undefined]),
  serving: t.union([t.number, t.undefined]),
  temperature: t.union([t.number, t.undefined]),
  humidity: t.union([t.number, t.undefined]),
});

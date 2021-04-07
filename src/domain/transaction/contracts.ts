import * as t from "io-ts";
import { date } from 'io-ts-types/lib/date';

export const transactionItem = t.interface({
  id: t.number,
  transaction: t.string,
  owner: t.string,
  date: date,
  account: t.string,
  description: t.union([t.string, t.undefined]),
  notes: t.union([t.string, t.undefined]),
  debit: t.number,
  credit: t.number,
  balance: t.number,
  prev: t.union([t.number, t.undefined]),
  deviceId: t.string,
});

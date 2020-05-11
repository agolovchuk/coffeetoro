import * as t from 'io-ts';

export const lang = t.union([t.literal('ru'), t.literal('en')]);

export const role = t.union([t.literal('user'), t.literal('manager')]);

export const user = t.interface({
  id: t.string,
  firstName: t.string,
  lastName: t.string,
  name: t.string,
  role: role,
  ava: t.string,
  lang: lang,
});

export const firebaseConfig = t.interface({
  apiKey: t.string,
  authDomain: t.string,
  databaseURL: t.string,
  storageBucket: t.string,
});

export const env = t.interface({
  id: t.string,
  multiplier: t.number,
  currency: t.string,
  user: t.union([t.null, user]),
  firebaseConfig: t.union([t.null, firebaseConfig]),
});
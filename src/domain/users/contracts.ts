import * as t from 'io-ts';

export const user = t.interface({
  id: t.string,
  firstName: t.string,
  lastName: t.string,
  name: t.string,
  role: t.union([t.literal('user'), t.literal('manager')]),
  ava: t.string,
  hash: t.string,
  lang: t.union([t.literal('en'), t.literal('ru')]),
  active: t.union([t.boolean, t.undefined]),
});

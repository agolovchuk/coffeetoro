import * as t from 'io-ts';

export const unit = t.interface({
  id: t.string,
  name: t.string,
  title: t.string,
  type: t.union([t.literal('weight'), t.literal('countable')]),
  sortIndex: t.number,
});

export const price = t.interface({
  id: t.string,
  categoryName: t.string,
  fromDate: t.string,
  expiryDate: t.union([t.string, t.null]),
  unitId: t.string,
  valuation: t.number,
  barcode: t.string,
  sortIndex: t.number,
});

export const category = t.interface({
  name: t.string,
  title: t.string,
  sortIndex: t.number,
  parentName: t.union([t.string, t.null]),
  count: t.number,
});
 
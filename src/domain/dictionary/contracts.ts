import * as t from 'io-ts';
import { date } from 'io-ts-types/lib/date';

export const unit = t.interface({
  id: t.string,
  name: t.string,
  title: t.string,
  type: t.union([t.literal('weight'), t.literal('countable')]),
  sortIndex: t.number,
});

const priceContainer = {
  id: t.string,
  parentId: t.string,
  add: date,
  expiry: t.union([date, t.null]),
  valuation: t.number,
  sortIndex: t.number,
}

export const price = t.union([
  t.interface({
    ...priceContainer,
    type: t.literal('tmc'),
    barcode: t.string,
  }),
  t.interface({
    ...priceContainer,
    type: t.literal('pc'),
    refId: t.string,
  }),
]);

export const category = t.interface({
  id: t.string,
  name: t.string,
  title: t.string,
  sortIndex: t.number,
  parentId: t.string,
});

export const tmc = t.interface({
  id: t.string,
  parentId: t.string,
  title: t.string,
  description: t.union([t.string, t.undefined]),
  barcode: t.union([t.string, t.undefined]),
  unitId: t.string,
  add: t.string,
  update: t.union([t.string, t.null, t.undefined]),
});

export const processCardsArticle = t.interface({
  id: t.string,
  quantity: t.number,
});

export const pc = t.interface({
  id: t.string,
  parentId: t.string,
  title: t.string,
  description: t.string,
  add: t.string,
  update: t.union([t.string, t.null, t.undefined]),
  articles: t.union([t.array(processCardsArticle), t.undefined]),
});

export const groupArticles = t.interface({
  id: t.string,
  title: t.string,
  description: t.union([t.string, t.undefined]),
  group: t.array(t.string),
})

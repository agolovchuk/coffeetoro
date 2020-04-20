import get from 'lodash/get';
import {
  ProductForSale,
  PriceItem,
  Units,
  CategoryItem,
  TMC,
  ProcessCards,
  PriceExtended,
  ProcessCardItem,
  TMCItem,
  ProcessCardArticle, GroupArticles,
} from './Types';

function priceAdapter(units: Units) {
  return (e: PriceExtended) => ({
    price: e,
    volume: get(units, [e.unitId, 'title'], 'psc'),
  })
}

export function getProductForSale(category: CategoryItem, price: PriceExtended[], units: Units): ProductForSale {
  return {
    ...category,
    valuation: price.map(priceAdapter(units))
  }
}

interface ISortebaleList {
  sortIndex: number;
}

export function sortByIndex<T extends ISortebaleList>(a: T, b: T) {
  return a.sortIndex - b.sortIndex;
}

/** Price */

function extendsPrice(price: PriceItem, tmc: TMC, pc: ProcessCards): PriceExtended {
  if (price.type === 'tmc') {
    const { title, description, unitId } = tmc[price.barcode];
    return { ...price, title, description, unitId };
  }
  const { title, description } = pc[price.refId];
  return { ...price, title, description, unitId: '1' };
}

export function extendsPriceList(priceList: ReadonlyArray<PriceItem>, tmc: TMC, pc: ProcessCards) {
  const adapter = (price: PriceItem) => extendsPrice(price, tmc, pc)
  return priceList.map(adapter);
}

interface PCFill extends Omit<ProcessCardItem, 'articles'> {
  articles: ReadonlyArray<{
    item: TMCItem,
    quantity: number,
  }>
}

export  function pcFill(item: ProcessCardItem | undefined, tmc: Record<string, TMCItem>): PCFill | undefined {
  if (item) {
    const articles: ReadonlyArray<ProcessCardArticle> = get(item, 'articles', []);
    return {
      ...item,
      articles: articles.map(e => ({ item: tmc[e.id], quantity: e.quantity })),
    };
  }
  return undefined;
}

export function groupFill(item: GroupArticles | undefined, tmc: Record<string, TMCItem>) {
  if(item) {
    return {
      ...item,
      group: (item.group || []).map(e => get(tmc, e)),
    }
  }
  return undefined;
}

export function toArray<T>(obj: Record<string, T>): ReadonlyArray<T> {
  return Object.values(obj);
}

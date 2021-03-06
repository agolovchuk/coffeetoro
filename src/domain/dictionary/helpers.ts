import get from 'lodash/get';
import pick from 'lodash/pick';
import isToday from 'date-fns/isToday';
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
  ProcessCardArticle, GroupArticles, ExpenseItem, Services,
  ExpenseExtended,
  EArticlesType,
} from './Types';
import { IUser } from 'domain/env/Types';

function priceAdapter(units: Units) {
  return (e: PriceExtended) => ({
    price: e,
    volume: get(units, [e.unitId, 'title'], 'psc'),
  })
}

export function getProductForSale(category: CategoryItem, price: PriceExtended[], units: Units): ProductForSale {
  return {
    ...category,
    valuation: price.filter(f => !f.expiry).map(priceAdapter(units))
  }
}

interface ISortebaleList {
  sortIndex: number;
}

export function sortByIndex<T extends ISortebaleList>(a: T, b: T) {
  return a.sortIndex - b.sortIndex;
}

/** Price */

export function extendsPrice(price: PriceItem, tmc: TMC, pc: ProcessCards): PriceExtended {
  if (price.type === EArticlesType.ARTICLES) {
    return { ...price, ...pick(get(tmc, price.barcode), ['title', 'description', 'unitId']) };
  }
  return { ...price, ...pick(get(pc, price.refId), ['title', 'description', 'primeCost']), unitId: '1' };
}

export function extendsPriceList(priceList: ReadonlyArray<PriceItem>, tmc: TMC, pc: ProcessCards) {
  const adapter = (price: PriceItem) => extendsPrice(price, tmc, pc);
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
      articles: (item.articles || []).map(e => get(tmc, e)),
    }
  }
  return undefined;
}

export function extendsExpanseList(list: ReadonlyArray<ExpenseItem>, tmc: TMC, services: Services): ReadonlyArray<ExpenseExtended> {
  return list.map((v) => {
    if(v.type === 'product') {
      const { title, description } = pick(get(tmc, v.barcode), ['title', 'description']);
      return {...v, title, description }
    }
    if (v.type === 'service') {
      const { title, description } = pick(get(services, v.refId), ['title', 'description']);
      return  {...v, title, description }
    }
    return v;
  }, []);
}

export function expenseByUser(ex: ReadonlyArray<ExpenseExtended>, user: IUser | null) {
  if (!user) return [];
  if (user.role === 'manager') return ex;
  return ex.filter(e => isToday(e.date) && (e.source === 'cash'));
}

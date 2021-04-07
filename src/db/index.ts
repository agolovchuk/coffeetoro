import { IDB, promisifyRequest, promisifyCursor } from '../lib/idbx';
import { DB_NAME, TABLE, READ_ONLY } from './constants';
import requestUpgrade from './migration';
import { tmcAdapter, unitAdapter } from 'domain/dictionary/adapters';
import {
  UnitItem,
  TMCItem,
  ProcessCardItem,
  PriceItem,
  PriceTMC,
  GroupArticles, ExpenseItem, ExpenseProduct,
} from 'domain/dictionary/Types';
import {
  DiscountItem,
  Order,
  OrderItem,
} from 'domain/orders/Types';
import { ITransactionItem, TTransactionItem } from 'domain/transaction/Types';
import get from "lodash/get";
import flatten from "lodash/fp/flatten";
import unionBy from "lodash/unionBy";
import { priceZip, separatePrice, expenseZip } from './helpers';

export * from '../lib/idbx';
export * from './constants';

export default class CDB extends IDB {
  constructor() {
    super(DB_NAME, requestUpgrade, 12);
  }

  getPriceByBarcode = async (barcode: string) => {
    const idb = await this.open();
    const transaction = idb.transaction([TABLE.price.name, TABLE.tmc.name], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osPrice = transaction.objectStore(TABLE.price.name).index(TABLE.price.index.barcode);
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const [price, article] = await Promise.all([
      promisifyRequest<PriceTMC | undefined>(osPrice.get(barcode)),
      promisifyRequest<TMCItem | undefined>(osTMC.get(barcode)),
    ]);
    return { price, article };
  }

  getArticleByBarcode = async (barcode: string): Promise<TMCItem & { unit: UnitItem } | null> => {
    const idb = await this.open();
    const transaction = idb.transaction([TABLE.tmc.name, TABLE.unit.name], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osUnits = transaction.objectStore(TABLE.unit.name);
    const tmc = tmcAdapter(await promisifyRequest(osTMC.get(barcode)));
    if (tmc) {
      const unit = unitAdapter(await promisifyRequest(osUnits.get(tmc.unitId)));
      if (unit) {
        return { ...tmc, unit }
      }
    }
    return null;
  }

  searchArticle = async (validator: (item: TMCItem) => boolean): Promise<ReadonlyArray<TMCItem>> => {
    const idb = await this.open();
    const transaction = idb.transaction([TABLE.tmc.name], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    return  new Promise((resolve, reject) => {
      const request = transaction.objectStore(TABLE.tmc.name).openCursor();
      let result: ReadonlyArray<TMCItem> = [];
      request.onsuccess = (event) => {
        const cursor = get(event, ['target', 'result']);
        if (cursor) {
          if(validator(cursor.value)) {
            result = [...result, cursor.value];
          }
          cursor.continue();
        }
        else {
          this.close();
          resolve(result);
        }
      };
      request.onerror = () => { this.close(); reject(); };
    })
  }

  getPricesByCategory = async(categoryId: string) => {
    const idb = await this.open();
    const transaction = idb.transaction([TABLE.tmc.name, TABLE.price.name, TABLE.processCards.name], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osPrice = transaction.objectStore(TABLE.price.name).index(TABLE.price.index.parentId);
    const osPC = transaction.objectStore(TABLE.processCards.name);
    const prices = await promisifyRequest<PriceItem[]>(osPrice.getAll(categoryId));
    const { tmc, pc } = separatePrice(prices);
    const articles = await Promise.all(
      tmc.map(e => promisifyRequest<TMCItem>(osTMC.get(e.barcode)))
    );
    const processCards = await Promise.all(
      pc.map(e => promisifyRequest<ProcessCardItem>(osPC.get(e.refId)))
    )
    return  {
      prices,
      articles,
      processCards,
    };
  }

  getOrderList = async () => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.orders.name,
      TABLE.orderItem.name,
    ]);
    transaction.oncomplete = () => { idb.close(); };
    const osOrders = transaction.objectStore(TABLE.orders.name).index(TABLE.orders.field.payment);
    const osOrderItems = transaction.objectStore(TABLE.orderItem.name).index(TABLE.orderItem.field.orderId);
    const orders = await promisifyRequest<Order[]>(osOrders.getAll(0));
    const counters = await Promise.all(
      orders.map(e => promisifyRequest(osOrderItems.count(e.id)))
    );
    return orders.map((e, i) => ({ ...e, count: counters[i] }));
  }

  getOrder = async(orderId: string) => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.orders.name,
      TABLE.orderItem.name,
      TABLE.price.name,
      TABLE.tmc.name,
      TABLE.processCards.name,
      TABLE.discountItem.name,
    ]);
    transaction.oncomplete = () => { idb.close(); };

    const ordersRequest = transaction.objectStore(TABLE.orders.name).get(orderId);
    const orderRequest = transaction.objectStore(TABLE.orderItem.name).index('orderId').getAll(orderId);
    const priceStore = transaction.objectStore(TABLE.price.name);
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osPC = transaction.objectStore(TABLE.processCards.name);
    const osDiscount = transaction.objectStore(TABLE.discountItem.name);

    const order = await promisifyRequest<Order>(ordersRequest);
    const orderItems = await promisifyRequest<OrderItem[]>(orderRequest);
    const discounts = await promisifyRequest<DiscountItem[]>(osDiscount.index(TABLE.discountItem.index.orderId).getAll(orderId));
    const prices = await Promise.all(
      orderItems.map(e => promisifyRequest<PriceItem>(priceStore.get(e.priceId)))
    );
    const { articles, processCards } = await priceZip(prices, osTMC, osPC);
    return {
      order,
      orderItems,
      prices,
      articles,
      processCards,
      discounts,
    }
  }

  getProcessCard = async (id: string) => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.processCards.name,
      TABLE.tmc.name,
    ], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osPC = transaction.objectStore(TABLE.processCards.name);
    const osTMC = transaction.objectStore(TABLE.tmc.name);
    const processCard = await promisifyRequest<ProcessCardItem | undefined>(osPC.get(id));
    if (processCard && processCard.articles && processCard.articles.length) {
      const articles: TMCItem[] = await Promise.all(
        processCard.articles.map(e => promisifyRequest<TMCItem>(osTMC.get(e.id)))
      );
      return  {
        processCard,
        articles,
      }
    }
    return  {
      processCard,
      articles: [] as TMCItem[],
    }
  }

  getGroupArticles = async (id: string) => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.groupArticles.name,
      TABLE.tmc.name,
    ], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osGA = transaction.objectStore(TABLE.groupArticles.name);
    const osTMC = transaction.objectStore(TABLE.tmc.name);
    const groupArticles = await promisifyRequest<GroupArticles | undefined>(osGA.get(id));
    if (groupArticles && groupArticles.articles && groupArticles.articles.length) {
      const articles: ReadonlyArray<TMCItem> = await Promise.all(
        groupArticles.articles.map(e => promisifyRequest<TMCItem>(osTMC.get(e))),
      );
      return  {
        groupArticles,
        articles,
      };
    }
    return  {
      groupArticles,
      articles: [] as TMCItem[],
    };
  }

  getPricesById = async (ids: ReadonlyArray<string>) => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.price.name,
      TABLE.processCards.name,
      TABLE.tmc.name,
    ], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osPrice = transaction.objectStore(TABLE.price.name);
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osPC = transaction.objectStore(TABLE.processCards.name);
    const prices = await Promise.all(
      ids.map(id => promisifyRequest<PriceItem>(osPrice.get(id)))
    );
    const { articles, processCards } = await priceZip(prices, osTMC, osPC);
    return  { prices, articles, processCards };
  }

  getExpense = async (from: Date, to: Date) => {
    const idb = await this.open();
    const query = IDBKeyRange.bound(from, to);
    const transaction = idb.transaction([
      TABLE.expenses.name,
      TABLE.tmc.name,
      TABLE.services.name,
    ], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osExpenses = transaction.objectStore(TABLE.expenses.name).index(TABLE.expenses.index.date);
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osServices = transaction.objectStore(TABLE.services.name);
    const expenses = await promisifyCursor<ExpenseItem>(osExpenses, query);
    const { articles, services } = await expenseZip(expenses, osTMC, osServices);
    return  {
      expenses,
      articles,
      services,
    }
  }

  getOrdersByDate = async (from: Date, to: Date) => {
    const idb = await this.open();
    const range = IDBKeyRange.bound(from, to);
    const transaction = idb.transaction([
      TABLE.orders.name,
      TABLE.orderItem.name,
      TABLE.tmc.name,
      TABLE.processCards.name,
      TABLE.price.name,
      TABLE.discountItem.name,
    ], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osOrders = transaction.objectStore(TABLE.orders.name);
    const osOrderItems = transaction.objectStore(TABLE.orderItem.name).index(TABLE.orderItem.field.orderId);

    const orders = await promisifyRequest<Order[]>(osOrders.index(TABLE.orders.field.date).getAll(range));

    const priceStore = transaction.objectStore(TABLE.price.name);
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osPC = transaction.objectStore(TABLE.processCards.name);
    const osDiscount = transaction.objectStore(TABLE.discountItem.name).index(TABLE.discountItem.index.orderId);

    const orderItemsList = await Promise.all(
      orders.map(e => promisifyRequest<OrderItem[]>(osOrderItems.getAll(e.id)))
    );

    const orderItems = flatten(orderItemsList);

    const prices = await Promise.all(
      unionBy(orderItems, e => e.priceId).map(e => promisifyRequest<PriceItem>(priceStore.get(e.priceId)))
    );

    const discounts = await Promise.all(
      orders.map(e => promisifyRequest<DiscountItem[]>(osDiscount.getAll(e.id)))
    );

    const { articles, processCards } = await priceZip(prices, osTMC, osPC);

    return {
      orders,
      orderItems,
      prices,
      articles,
      processCards,
      discounts: flatten(discounts),
    }
  }

  getEntryPrice = async () => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.expenses.name,
    ], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osExpenses = transaction.objectStore(TABLE.expenses.name).index(TABLE.expenses.index.type);
    const expanse = await promisifyCursor<ExpenseProduct>(osExpenses, 'product');
    const def = { s: 0, q: 0, min: Infinity, max: 0 };
    return expanse.reduce((a, v) => {
      const current = get(a, v.barcode, def);
      return {
        ...a,
        [v.barcode]: {
          s: (v.quantity * v.valuation) + current.s,
          q: v.quantity + current.q,
          min: Math.min(v.valuation, current.min),
          max: Math.max(v.valuation, current.max)
        },
      }
    }, {});
  }

  getLastTransactionLog = async (account: string) => {
    const { transaction, table, indexes } = await this.getTransaction(TABLE.transactionLog);
    const osTransactionLog = transaction.objectStore(table).index(indexes.account);
    return promisifyCursor<ITransactionItem>(osTransactionLog, account, {
      direction: "prev",
      isFinish: (d: ITransactionItem, r: ITransactionItem[]) => (r.length === 1),
    });
  }

  addTransaction = async (transaction: TTransactionItem) => {
    await this.addItem(TABLE.transactionLog.name, transaction);
    return transaction.transaction;
  }
}



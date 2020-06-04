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
  GroupArticles, ExpenseItem,
} from 'domain/dictionary/Types';
import {
  DiscountItem,
  Order,
  OrderItem,
} from 'domain/orders/Types';
import get from "lodash/get";
import { priceZip, separatePrice, expenseZip } from './helpers';

export * from '../lib/idbx';

export default class CDB extends IDB {
  constructor() {
    super(DB_NAME, requestUpgrade, 4);
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

  getExpense = async (query = null) => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.expenses.name,
      TABLE.tmc.name,
      TABLE.services.name,
    ], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osExpenses = transaction.objectStore(TABLE.expenses.name);
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

}



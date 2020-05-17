import { IDB, promisifyReques } from '../lib/idbx';
import { DB_NAME, TABLE, READ_ONLY } from './constants';
import requestUpgrade from './migration';
import { tmcAdapter, unitAdapter } from 'domain/dictionary/adapters';
import {
  UnitItem,
  TMCItem,
  ProcessCardItem,
  PriceItem,
  PriceTMC,
  PricePC,
  GroupArticles,
} from 'domain/dictionary/Types';
import {
  Order,
  OrderItem,
} from 'domain/orders/Types';
import get from "lodash/get";

export * from '../lib/idbx';

interface PriceByType {
  tmc: ReadonlyArray<PriceTMC>;
  pc: ReadonlyArray<PricePC>;
}

function separatePrice(prices: PriceItem[]) {
  return prices.reduce((a, v) => (
    { ...a, [v.type]: [...a[v.type], v] }
  ), { tmc: [], pc: [] } as PriceByType);
}

async function priceZip(prices: PriceItem[], osTMC: IDBIndex, osPC: IDBObjectStore) {
  const { tmc, pc } = separatePrice(prices);
  const articles = await Promise.all(
    tmc.map(e => promisifyReques<TMCItem>(osTMC.get(e.barcode)))
  );
  const processCards = await Promise.all(
    pc.map(e => promisifyReques<ProcessCardItem>(osPC.get(e.refId)))
  )
  return {
    articles,
    processCards,
  }
}

export default class CDB extends IDB {
  constructor() {
    super(DB_NAME, requestUpgrade);
  }

  getPriceByBarcode = async (barcode: string) => {
    const idb = await this.open();
    const transaction = idb.transaction([TABLE.price.name, TABLE.tmc.name], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osPrice = transaction.objectStore(TABLE.price.name).index(TABLE.price.index.barcode);
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const [price, article] = await Promise.all([
      promisifyReques<PriceTMC | undefined>(osPrice.get(barcode)),
      promisifyReques<TMCItem | undefined>(osTMC.get(barcode)),
    ]);
    return { price, article };
  }

  getArticleByBarcode = async (barcode: string): Promise<TMCItem & { unit: UnitItem } | null> => {
    const idb = await this.open();
    const transaction = idb.transaction([TABLE.tmc.name, TABLE.unit.name], READ_ONLY);
    transaction.oncomplete = () => { idb.close(); };
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osUnits = transaction.objectStore(TABLE.unit.name);
    const tmc = tmcAdapter(await promisifyReques(osTMC.get(barcode)));
    if (tmc) {
      const unit = unitAdapter(await promisifyReques(osUnits.get(tmc.unitId)));
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
    const prices = await promisifyReques<PriceItem[]>(osPrice.getAll(categoryId));
    const { tmc, pc } = separatePrice(prices);
    const articles = await Promise.all(
      tmc.map(e => promisifyReques<TMCItem>(osTMC.get(e.barcode)))
    );
    const processCards = await Promise.all(
      pc.map(e => promisifyReques<ProcessCardItem>(osPC.get(e.refId)))
    )
    return  {
      prices,
      articles,
      processCards,
    };
  }

  getOrder = async(orderId: string) => {
    const idb = await this.open();
    const transaction = idb.transaction([
      TABLE.orders.name,
      TABLE.orderItem.name,
      TABLE.price.name,
      TABLE.tmc.name,
      TABLE.processCards.name,
    ]);
    transaction.oncomplete = () => { idb.close(); };

    const ordersRequest = transaction.objectStore(TABLE.orders.name).get(orderId);
    const orderRequest = transaction.objectStore(TABLE.orderItem.name).index('orderId').getAll(orderId);
    const priceStore = transaction.objectStore(TABLE.price.name);
    const osTMC = transaction.objectStore(TABLE.tmc.name).index(TABLE.tmc.index.barcode);
    const osPC = transaction.objectStore(TABLE.processCards.name);

    const order = await promisifyReques<Order>(ordersRequest);
    const orderItems = await promisifyReques<OrderItem[]>(orderRequest);
    const prices = await Promise.all(
      orderItems.map(e => promisifyReques<PriceItem>(priceStore.get(e.priceId)))
    );
    const { articles, processCards } = await priceZip(prices, osTMC, osPC);
    return {
      order,
      orderItems,
      prices,
      articles,
      processCards,
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
    const processCard = await promisifyReques<ProcessCardItem | undefined>(osPC.get(id));
    if (processCard && processCard.articles && processCard.articles.length) {
      const articles: TMCItem[] = await Promise.all(
        processCard.articles.map(e => promisifyReques<TMCItem>(osTMC.get(e.id)))
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
    const groupArticles = await promisifyReques<GroupArticles | undefined>(osGA.get(id));
    if (groupArticles && groupArticles.articles && groupArticles.articles.length) {
      const articles: ReadonlyArray<TMCItem> = await Promise.all(
        groupArticles.articles.map(e => promisifyReques<TMCItem>(osTMC.get(e))),
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
      ids.map(id => promisifyReques<PriceItem>(osPrice.get(id)))
    );
    const { articles, processCards } = await priceZip(prices, osTMC, osPC);
    return  { prices, articles, processCards };
  }

}

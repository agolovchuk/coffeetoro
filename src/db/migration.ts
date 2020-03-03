import * as C from './constants';
import * as Fixtures from './fixtures';

export default function requestUpgrade(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any {
  if (ev.oldVersion < 1) {
// =========== Orders ==============================
    const osOrders = this.result.createObjectStore(
      C.TABLE.orders.name, {
        keyPath: C.TABLE.orders.field.id,
        autoIncrement: false
      }
    );
    osOrders.createIndex(
      C.TABLE.orders.field.payment,
      C.TABLE.orders.field.payment, {
        unique: false
      }
    );
    osOrders.createIndex(
      C.TABLE.orders.field.client,
      C.TABLE.orders.field.client, {
        unique: false
      }
    );
    osOrders.createIndex(
      C.TABLE.orders.field.owner,
      C.TABLE.orders.field.owner, {
        unique: false
      }
    );
    osOrders.createIndex(C.TABLE.orders.field.orderIdPayment, [
      C.TABLE.orders.field.id,
      C.TABLE.orders.field.payment,
    ], {
      unique: true
    });
// =========== Order item ==============================
    const osOrderItem = this.result.createObjectStore(
      C.TABLE.orderItem.name, {
        keyPath: [
          C.TABLE.orderItem.field.orderId,
          C.TABLE.orderItem.field.priceId
      ], autoIncrement: false }
    );
    osOrderItem.createIndex(
      C.TABLE.orderItem.field.orderId,
      C.TABLE.orderItem.field.orderId, {
        unique: false
      }
    );
    osOrderItem.createIndex(
      C.TABLE.orderItem.field.priceId,
      C.TABLE.orderItem.field.priceId, {
        unique: false
      }
    );
    osOrderItem.createIndex(C.TABLE.orderItem.field.id, [
      C.TABLE.orderItem.field.orderId,
      C.TABLE.orderItem.field.priceId
    ], {
      unique: true
    });
// ======== Category ==================================
    const osCategory = this.result.createObjectStore(
      C.TABLE.category.name, {
        keyPath: C.TABLE.category.field.name,
        autoIncrement: false,
      }
    );
    osCategory.createIndex(
      C.TABLE.category.field.name,
      C.TABLE.category.field.name, {
        unique: true,   
      }
    );
    osCategory.createIndex(
      C.TABLE.category.field.parentName,
      C.TABLE.category.field.parentName, {
        unique: false, 
      }
    );

// ===================== Price ==========================
    const osPrice = this.result.createObjectStore(
      C.TABLE.price.name, {
        keyPath: C.TABLE.price.field.id,
        autoIncrement: false,
      }
    );
    osPrice.createIndex(
      C.TABLE.price.field.categoryName,
      C.TABLE.price.field.categoryName, {
        unique: false,
      }
    );
    osPrice.createIndex(
      'priceId', [
        C.TABLE.price.field.categoryName,
        C.TABLE.price.field.unitId,
        C.TABLE.price.field.expiryDate,
      ], {
        unique: true
      }
    );
    osPrice.createIndex(
      C.TABLE.price.field.barcode,
      C.TABLE.price.field.barcode, {
        unique: false,
      }
    );
// =================== Unit =============================
    const osUnit = this.result.createObjectStore(
      C.TABLE.unit.name, {
        keyPath: C.TABLE.unit.field.id,
        autoIncrement: false,
      }
    );
    osUnit.createIndex(
      C.TABLE.unit.field.id,
      C.TABLE.unit.field.id, {
        unique: true,
      }
    );
// ======================================================
    const osUsers = this.result.createObjectStore(
      C.TABLE.users.name, {
        keyPath: C.TABLE.users.index.id,
        autoIncrement: false,
      }
    );
    osUsers.createIndex(
      C.TABLE.users.index.id,
      C.TABLE.users.index.id, {
        unique: true,
      }
    );
// ======================================================
    const osEnv = this.result.createObjectStore(
      C.TABLE.env.name, {
        keyPath: C.TABLE.env.index.id,
        autoIncrement: false,
      }
    );
    osEnv.createIndex(
      C.TABLE.env.index.id,
      C.TABLE.env.index.id, {
        unique: true,
      }
    );
// ======================================================
  }
  return [
    { table: C.TABLE.category.name, data: Fixtures.categories },
    { table: C.TABLE.unit.name, data: Fixtures.units },
    { table: C.TABLE.env.name, data: Fixtures.env },
    { table: C.TABLE.users.name, data: Fixtures.users },
  ];
}
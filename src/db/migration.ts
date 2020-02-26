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

// ========= Product =================================
    const osProduct = this.result.createObjectStore(
      C.TABLE.product.name, {
        keyPath: C.TABLE.product.field.name,
        autoIncrement: false,
      }
    );
    osProduct.createIndex(
      C.TABLE.product.field.name,
      C.TABLE.product.field.name, {
        unique: true
      }
    );
    osProduct.createIndex(
      C.TABLE.product.field.categoryName,
      C.TABLE.product.field.categoryName, {
        unique: false
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
      C.TABLE.price.field.productName,
      C.TABLE.price.field.productName, {
        unique: false,
      }
    );
    osPrice.createIndex(
      'priceId', [
        C.TABLE.price.field.productName,
        C.TABLE.price.field.unitId,
        C.TABLE.price.field.expiryDate,
      ], {
        unique: true
      }
    );
    osPrice.createIndex(
      C.TABLE.product.field.barcode,
      C.TABLE.product.field.barcode, {
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
  }
  return [
    { table: C.TABLE.category.name, data: Fixtures.categories },
    { table: C.TABLE.product.name, data: Fixtures.products },
    { table: C.TABLE.unit.name, data: Fixtures.units },
  ];
}
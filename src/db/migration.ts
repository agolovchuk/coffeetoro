import * as C from './constants';

export default function requestUpgrade(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent): any {
  if (ev.oldVersion === 0) {
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
  }
}
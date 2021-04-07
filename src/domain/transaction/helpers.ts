import currency from 'currency.js';
import last from 'lodash/last'
import CDB, { TABLE } from 'db';
import { getId } from 'lib/id';
import { AppState } from 'domain/StoreType';

import { Order, PaymentMethod } from 'domain/orders/Types';
import { ITransactionItem, TTransactionItem } from './Types';
import {
  TRANSACTION_ID_LENGTH,
  DEFAULT_OWNER,
  DEFAULT_ACCOUNT,
  DEFAULT_BANK_ACCOUNT,
  DEFAULT_TRANSACTION_PREV,
  DEFAULT_DEVICE_ID,
} from './constants';
import * as selectors from "../orders/selectors";

function transactionFactory(data: Partial<ITransactionItem> = {}): TTransactionItem {
  return {
    transaction: getId(TRANSACTION_ID_LENGTH),
    date: new Date(),
    debit: 0,
    credit: 0,
    balance: 0,
    owner: DEFAULT_OWNER,
    account: DEFAULT_ACCOUNT,
    prev: DEFAULT_TRANSACTION_PREV,
    deviceId: DEFAULT_DEVICE_ID,
    description: '',
    notes: '',
    ...data,
  }
}

function paymentMethodToAccount(method: PaymentMethod | string): string {
  if (typeof method === 'string') return method;
  if (method === PaymentMethod.Bank) return DEFAULT_BANK_ACCOUNT;
  if (method === PaymentMethod.Cash) return DEFAULT_ACCOUNT;
  throw new Error('Incorrect payment method');
}

async function getLastTransaction(account: string): Promise<ITransactionItem> {
  const idb = new CDB();
  const res = await idb.getLastTransactionLog(account);
  return last(res) || { ...transactionFactory(), id: DEFAULT_TRANSACTION_PREV };
}

async function addTransaction(entry: TTransactionItem): Promise<number> {
  const idb = new CDB();
  return (idb.addItem(TABLE.transactionLog.name, entry) as Promise<number>);
}

type OrderValuation = Order & Pick<ITransactionItem, 'credit'>

export async function orderToTransaction(
  deviceId: string,
  { date, owner, credit, payment }: OrderValuation,
): Promise<TTransactionItem> {
  const account = paymentMethodToAccount(payment);
  const { balance, id } = await getLastTransaction(account);
  return transactionFactory({
    date,
    owner,
    account,
    credit,
    prev: id,
    deviceId,
    balance: currency(balance).add(credit).value,
  });
}

export interface IOrderContainer {
  id: string;
  payment: PaymentMethod.Opened | string;
  date: Date;
  owner: string;
}

export async function orderToTransactionAction(getState: () => AppState, order: IOrderContainer): Promise<ITransactionItem> {
  const state = getState();
  const credit = selectors.orderSummSelector(state, { match: { params: { orderId: order.id }}});
  const { deviceId } = state.env;
  const account = paymentMethodToAccount(order.payment);
  const { balance, id: prev } = await getLastTransaction(account);
  const transaction = transactionFactory({
    date: order.date,
    owner: order.owner,
    account,
    credit,
    prev,
    deviceId,
    balance: currency(balance).add(credit).value,
  });
  const id = await addTransaction(transaction);
  return { ...transaction, id };
}

export async function addOrderTransaction(deviceId: string, order: OrderValuation): Promise<unknown> {
  const transaction = await orderToTransaction(deviceId, order);
  return addTransaction(transaction);
}

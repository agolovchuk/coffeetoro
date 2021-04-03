import currency from 'currency.js';
import last from 'lodash/last'
import CDB from 'db';
import { getId } from 'lib/id';

import { Order, PaymentMethod } from 'domain/orders/Types';
import { ITransaction } from './Types';
import {
  TRANSACTION_ID_LENGTH,
  DEFAULT_OWNER,
  DEFAULT_ACCOUNT,
  DEFAULT_BANK_ACCOUNT,
  DEFAULT_TRANSACTION_PREV,
  DEFAULT_DEVICE_ID,
} from './constants';

function transactionFactory(data: Partial<ITransaction> = {}): ITransaction {
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
    ...data,
  }
}

function paymentMethodToAccount(method: PaymentMethod | string): string {
  if (typeof method === 'string') return method;
  if (method === PaymentMethod.Bank) return DEFAULT_BANK_ACCOUNT;
  if (method === PaymentMethod.Cash) return DEFAULT_ACCOUNT;
  throw new Error('Incorrect payment method');
}

async function getLastTransaction(account: string): Promise<ITransaction> {
  const idb = new CDB();
  const res = await idb.getLastTransactionLog(account);
  return last(res) || transactionFactory();
}

async function addTransaction(entry: ITransaction): Promise<string> {
  const idb = new CDB();
  return idb.addTransaction(entry);
}

type OrderValuation = Order & Pick<ITransaction, 'credit'>

async function orderToTransaction(
  deviceId: string,
  { date, owner, credit }: OrderValuation,
  account: string = DEFAULT_ACCOUNT
): Promise<ITransaction> {
  const { balance, id } = await getLastTransaction(account);
  return transactionFactory({
    date,
    owner,
    account,
    credit,
    prev: id,
    balance: currency(balance).add(credit).value,
  });
}

export async function addOrderTransaction(deviceId: string, order: OrderValuation): Promise<string> {
  const account = paymentMethodToAccount(order.payment);
  const transaction = await orderToTransaction(deviceId, order, account);
  return addTransaction(transaction);
}

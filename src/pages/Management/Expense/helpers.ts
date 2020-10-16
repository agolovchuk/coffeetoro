import { getId } from "lib/id";
import { ExpenseExtended } from "domain/dictionary";
import omit from 'lodash/omit';

export function articleUpdateAdapter({ type, refId, barcode, quantity, ...rest }: any) {
  const q = Number(quantity);
  return {
    ...rest,
    type: 'product',
    barcode: barcode || '',
    quantity: isNaN(q) ? 1 : q,
  }
}

export function serviceUpdateAdapter({ type, barcode, refId, quantity, ...rest }: any) {
  return {
    ...rest,
    type: 'service',
    refId: refId || 'null',
  }
}

export function remittanceUpdateAdapter({ type, title, foreignId, description, barcode, refId, quantity, ...rest }: any) {
  return {
    ...rest,
    type: 'remittance',
  }
}

export function cleanExp(d: any) {
  const v = omit(d, ['title', 'description']);
  if (v.type === 'remittance') return remittanceUpdateAdapter(v);
  if (v.type === 'service') return serviceUpdateAdapter(v);
  return articleUpdateAdapter(v);
}

export function editAdapter(value: ExpenseExtended) {
  return {
    ...value,
    isEdit: true,
  }
}

export function createItem(): ExpenseExtended {
  return {
    id: getId(8),
    createBy: '',
    title: '',
    foreignId: '',
    valuation: 0,
    date: new Date(),
    type: 'product',
    barcode: '',
    quantity: 1,
    source: 'cash',
    about: '',
  }
}

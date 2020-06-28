import { getId } from "lib/id";
import { ExpenseExtended } from "domain/dictionary";

export function articleUpdateAdapter({ type, refId, barcode, quantity, ...rest }: any) {
  return {
    ...rest,
    type: 'product',
    barcode: barcode || '',
    quantity: quantity || 1,
  }
}

export function serviceUpdateAdapter({ type, barcode, refId, quantity, ...rest }: any) {
  return {
    ...rest,
    type: 'service',
    refId: refId || 'null',
    quantity: quantity || 1,
  }
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

import { DocumentItem, DocumentType, MoneySource, SheetType } from 'domain/dictionary/Types';
import { getId } from 'lib/id';

export function createDocumentGroup(createBy?: string): DocumentItem {
  return {
    id: getId(8),
    date: new Date(),
    createBy,
    type: SheetType.EXPENSE,
    account: MoneySource.CASH,
    about: '',
  }
}

export function editAdapter(value: DocumentItem) {
  return {
    ...value,
    isEdit: true,
  }
}

export const SHEET_TYPE = [
  { name: SheetType.INCOME, title: 'Приход' },
  { name: SheetType.EXPENSE, title: 'Расход' },
]

export const ACCOUNT = [
  { name: MoneySource.CASH, title: 'Касса' },
  { name: MoneySource.BANK, title: 'Банк' },
  { name: MoneySource.INCOME, title: 'Сторонние' },
]

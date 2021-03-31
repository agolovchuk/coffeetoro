export interface ITransaction {
  id?: number;
  transaction: string;
  owner: string;
  date: Date;
  account: string;
  description?: string;
  notes?: string;
  debit: number;
  credit: number;
  balance: number;
  prev?: number;
  deviceId: string;
}

export interface IWarehouse {
  id: string;
  transaction: string;
  date: Date;
  article: string;
  expense: number;
  income: number;
  balance: number;
}

export interface ICredit {
  credit: number;
}

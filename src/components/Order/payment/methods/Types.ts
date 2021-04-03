import { PaymentMethod } from 'domain/orders/Types';

export interface IAccounts {
  id: string;
  name: string;
  cashLess: boolean;
}

export interface Props {
  accounts: ReadonlyArray<IAccounts>;
  setMethod(id: string): void;
}

export interface IUseElementsProps {
  valuation: number;
  onCancel(): void;
  method: string | PaymentMethod.Opened;
  accounts: ReadonlyArray<IAccounts>;
}

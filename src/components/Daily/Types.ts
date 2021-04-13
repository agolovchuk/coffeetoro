export interface DayReportParams {
  cash: number,
  bank: number,
}

export interface IOrderItem {
  id: string;
  valuation: number;
  quantity: number;
  title: string;
  description?: string;
}

export interface DiscountItem {
  discountId: string;
  orderId: string;
  valuation: number;
}

export interface IOrder {
  id: string;
  date: string;
  payment: string;
  owner: string;
  items: ReadonlyArray<IOrderItem>;
  discounts?: ReadonlyArray<DiscountItem>
}

export interface IAccountItem {
  id: string;
  name: string;
}

export interface IReportProps {
  summary: {
    discount: number;
    income: number;
    orders: number;
  }
  articles: ReadonlyArray<any>;
  orders: ReadonlyArray<IOrder>;
  date: string;
  children?: JSX.Element;
  linkPrefix: string;
  accounts: Record<string, IAccountItem>;
}

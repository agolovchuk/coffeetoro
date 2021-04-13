import { DiscountItem } from 'domain/orders/Types';

export interface OrderArchiveContent {
  priceId: string;
  quantity: number;
  valuation: number;
}

export interface OrderArchiveItem {
  client: string;
  date: string;
  id: string;
  payment: string;
  items: ReadonlyArray<OrderArchiveContent>;
  discounts: ReadonlyArray<DiscountItem>;
  owner: string;
}

export interface EntryPriceItem {
  s: number,
  q: number,
  min: number,
  max: number,
}

export interface ReportState {
  readonly reports: Record<string, OrderArchiveItem>;
  readonly entryPrice: Record<string, EntryPriceItem>;
}

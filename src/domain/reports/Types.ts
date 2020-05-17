export interface OrderArchiveContent {
  priceId: string;
  quantity: number;
  valuation: number;
}
export interface OrderArchiveItem {
  client: string;
  date: string;
  id: string;
  payment: 1 | 2;
  items: ReadonlyArray<OrderArchiveContent>
}

export interface ReportState {
  readonly reports: ReadonlyArray<OrderArchiveItem>;
}

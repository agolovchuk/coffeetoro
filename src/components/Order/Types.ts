interface IPrice {
  id: string;
  valuation: number;
  parentId: string;
  title: string;
  description?: string;
}

export interface OrderItemContainer {
  price: IPrice;
  quantity: number;
}

export interface OrderApi {
  onRemove: () => void;
}

export interface DiscountItem {
  orderId: string,
  discountId: string,
  valuation: number,
}

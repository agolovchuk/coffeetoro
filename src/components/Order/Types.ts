interface IPrice {
  valuation: number;
}

export interface OrderItemContainer {
  price: IPrice;
  quantity: number;
  product: {
    title: string;
    name: string;
    categoryName: string;
  },
  volume: {
    title: string;
    name: string;
  },
}

export interface OrderApi {
  onRemove: () => void;
}
interface IPrice {
  valuation: number;
}

export interface OrderItemContainer {
  price: IPrice;
  quantity: number;
  category: {
    id: string;
    title: string;
    name: string;
    // categoryName: string;
  },
  volume: {
    title: string;
    name: string;
  },
}

export interface OrderApi {
  onRemove: () => void;
}
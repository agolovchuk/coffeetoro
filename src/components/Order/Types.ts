interface IPrice {
  id: string;
  valuation: number;
  parentId: string;
  title: string;
  description: string;
}

export interface OrderItemContainer {
  price: IPrice;
  quantity: number;
  // category: {
  //   id: string;
  //   title: string;
  //   name: string;
  //   // categoryName: string;
  // }
}

export interface OrderApi {
  onRemove: () => void;
}
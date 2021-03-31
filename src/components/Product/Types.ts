export interface ProductApi {
  addOrder: (id: string, priceId: string, quantity: number) => void,
}

export interface IPrice {
  id: string;
  valuation: number;
  description?: string;
}

export interface IValuation {
  price: IPrice;
  volume: string;
}

export interface IOrderApi {
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
  isChecked: (id: string) => boolean;
}
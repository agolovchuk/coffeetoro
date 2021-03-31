import { PriceExtended } from "domain/dictionary";

export interface Article {
  price: PriceExtended;
  volume: string;
}

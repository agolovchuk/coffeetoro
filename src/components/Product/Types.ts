export interface ProductApi {
  addOrder: (id: string, priceId: string, quantity: number) => void,
}

interface APPState {
  env: {
    multiplier: number;
    currency: string;
  }
}

export interface APPStore {
  getState: () => APPState;
}
export interface IEnv {
  multiplier: number;
  currency: string;
  activeOrder: string | null;
}

export interface EnvState {
  env: IEnv;
}

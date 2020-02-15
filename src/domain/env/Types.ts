export interface User {
  readonly id: string;
  readonly firstName: string | undefined;
  readonly lastName: string | undefined;
  readonly nikName: string | undefined;
}

export interface IEnv {
  multiplier: number;
  currency: string;
  user: User;
}

export interface EnvState {
  env: IEnv;
}

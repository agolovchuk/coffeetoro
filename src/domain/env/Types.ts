export type RoleType = 'user' | 'manager';

export interface IUser {
  readonly id: string;
  readonly firstName: string | undefined;
  readonly lastName: string | undefined;
  readonly nikName: string;
  readonly role: RoleType;
  readonly ava: string;
}

export interface IEnv {
  multiplier: number;
  currency: string;
  user: IUser;
}

export interface EnvState {
  env: IEnv;
}

export type RoleType = 'user' | 'manager';

export interface IUser {
  readonly id: string;
  readonly firstName: string | undefined;
  readonly lastName: string | undefined;
  readonly name: string;
  readonly role: RoleType;
  readonly ava: string;
}

export interface IEnv {
  id: 'default';
  multiplier: number;
  currency: string;
  user: IUser | null;
}

export type DBEnv = IEnv & {
  user: string | null;
}

export interface EnvState {
  env: IEnv;
}

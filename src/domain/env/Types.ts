import { TypeOf } from 'io-ts';
import { role, lang, env, firebaseConfig, session } from './contracts';

export enum UserRole {
  USER = 'user',
  MANAGER = 'manager',
}

export type RoleType = TypeOf<typeof role>;
export type LangType = TypeOf<typeof lang>;
export type FirebaseConfig = TypeOf<typeof firebaseConfig>;

export interface IUser {
  readonly id: string;
  readonly firstName: string | undefined;
  readonly lastName: string | undefined;
  readonly name: string;
  readonly role: RoleType;
  readonly ava: string;
  readonly lang: LangType;
}

export type ISession = TypeOf<typeof session>;

export type IEnv = TypeOf<typeof env>;

export type DBEnv = IEnv & {
  user: string | null;
}

export interface EnvState {
  env: IEnv;
}

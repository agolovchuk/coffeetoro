import { TypeOf } from 'io-ts';
import { role, lang, env, firebaseConfig } from './contracts';

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

export type IEnv = TypeOf<typeof env>;

export type DBEnv = IEnv & {
  user: string | null;
}

export interface EnvState {
  env: IEnv;
}

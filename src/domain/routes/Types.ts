import { match } from 'react-router-dom';

export interface Params {
  readonly type?: string;
  readonly category?: string;
  readonly product?: string;
}

export type ParamsNames = keyof Params;

export interface PropsMatch {
  readonly match: match<Params>;
}
import { match } from 'react-router-dom';

export interface Params {
  readonly orderId?: string;
  readonly type?: string;
  readonly category?: string;
  readonly product?: string;
}

export type ParamsNames = keyof Params;

export interface PropsMatch<T = Params> {
  readonly match: match<T>;
}

interface ILocation {
  readonly pathname: string;
  readonly search: string;
  readonly hash: string;
}

interface IRouter {
  readonly location: ILocation;
  readonly action: 'POP'
}

export interface RouterState {
  router: IRouter;
}
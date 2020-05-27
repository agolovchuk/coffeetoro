import { match } from 'react-router-dom';

export interface Params {
  readonly orderId?: string;
  readonly type?: string;
  readonly categoryId?: string;
  readonly product?: string;
  readonly pcId?: string;
  readonly groupId?: string;
}

export interface PropsMatch<T = Params> {
  readonly match: match<T>;
}

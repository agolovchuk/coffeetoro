import { Params } from './Types';

interface PropsMatch<T = Params> {
  match: {
    params: T
  }
}

export const params = (state: any, props: PropsMatch) => props.match.params;

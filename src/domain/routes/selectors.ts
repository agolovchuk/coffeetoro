import { PropsMatch } from './Types';

export const params = (state: any, props: PropsMatch) => props.match.params;

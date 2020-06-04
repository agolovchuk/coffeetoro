import { TypeOf } from 'io-ts';
import * as contracts from './contracts';

export type DayItem = TypeOf<typeof contracts.dayItem>;

export interface DailyState {
  readonly daily: Record<string, DayItem>;
}

import { Action, AnyAction } from 'redux';
import { ThunkAction as Thunk } from 'redux-thunk';
import { DictionaryState } from 'domain/dictionary/Types';
import { OrderState } from 'domain/orders/Types';
import { EnvState } from 'domain/env/Types';
import { UsersState } from 'domain/users';
import { ReportState } from 'domain/reports/Types';
import { DailyState } from 'domain/daily/Types';

export interface AppState extends DictionaryState, OrderState, EnvState, UsersState, ReportState, DailyState {};

export type ThunkAction<A extends Action, R = void> = Thunk<R, AppState, undefined, AnyAction>;

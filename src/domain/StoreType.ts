import { Action, AnyAction } from 'redux';
import { ThunkAction as Thunk } from 'redux-thunk';
import { DictionaryState } from './dictionary/Types';
import { OrderState } from './orders/Types';
import { EnvState } from './env/Types';
import { RouterState } from './routes';
import { UsersState } from './users';
import { ReportState } from './reports/Types';

export interface AppState extends DictionaryState, OrderState, EnvState, RouterState, UsersState, ReportState {};

export type ThunkAction<A extends Action, R = void> = Thunk<R, AppState, undefined, AnyAction>;

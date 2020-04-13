import { Action } from 'redux';
import { ThunkAction as Thunk } from 'redux-thunk';
import { DictionaryState } from './dictionary/Types';
import { OrderState } from './orders/Types';
import { EnvState } from './env/Types';
import { RouterState } from './routes';
import { UsersState } from './users'

export interface AppState extends DictionaryState, OrderState, EnvState, RouterState, UsersState {};

export type ThunkAction<A extends Action> = Thunk<void, AppState, undefined, A>;
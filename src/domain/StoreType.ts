import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { DictionaryState } from './dictionary/Types';
import { OrderState } from './orders/Types';
import { EnvState } from './env/Types';
import { RouterState } from './routes';
import { UsersState } from './users'

export interface AppState extends DictionaryState, OrderState, EnvState, RouterState, UsersState {};

export type Thunk<R, A extends Action> = ThunkAction<R, AppState, undefined, A>;
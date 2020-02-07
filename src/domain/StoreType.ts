import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { DictionaryState } from './dictionary/Types';
import { OrderState } from './orders/Types';
import { EnvState } from './env/Types';
import { RouterState } from './routes';

export interface AppState extends DictionaryState, OrderState, EnvState, RouterState {};

export type Thunk<R, A extends Action> = ThunkAction<R, OrderState, undefined, A>;
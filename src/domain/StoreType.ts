import { DictionaryState } from './dictionary/Types';
import { OrderState } from './orders/Types';
import { EnvState } from './env/Types';

export interface AppState extends DictionaryState, OrderState, EnvState {};

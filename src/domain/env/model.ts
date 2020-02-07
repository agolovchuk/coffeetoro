import * as A from './actions';
import { IEnv } from './Types';

function env() {
  return {
    multiplier: 1000,
    currency: 'грн.',
    activeOrder: null,
  }
}

type Action = ReturnType<typeof A.setActiveOrder>

export const reducer = {
  env(state: IEnv = env(), action: Action) {
    switch (action.type) {

      default:
        return state;
    }
  },
};

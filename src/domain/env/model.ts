import * as A from './actions';
import { IEnv } from './Types';

function env(): IEnv {
  return {
    multiplier: 1000,
    currency: 'UAH',
    user: {
      id: '0',
      firstName: '',
      lastName: '',
      nikName: 'Max',
      role: 'manager',
    }
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

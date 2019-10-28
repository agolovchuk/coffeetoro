import { EnvState } from './Types';

function env() {
  return {
    multiplier: 1000,
    currency: 'грн.',
  }
}

type Action = {
  type: string,
} 


export const reducer = {
  env(state: EnvState = env(), action: Action) {
    switch (action.type) {

      default:
        return state;
    }
  },
};

import * as A from './actions';
import set from 'lodash/fp/set';
import merge from 'lodash/fp/merge';
import update from 'lodash/fp/update';
import { IEnv } from './Types';
import { Action as UserAction, UPDATE_USER } from 'domain/users';

function env(): IEnv {
  return {
    id: 'default',
    multiplier: 1000,
    currency: 'UAH',
    user: null,
  }
}

export const reducer = {
  env(state: IEnv = env(), action: A.Action | UserAction) {
    switch (action.type) {

      case A.LOGOUT:
        return set('user')(null)(state);

      case A.LOGIN:
        return set('user')(action.payload)(state);

      case UPDATE_USER:
        return update('user')(m => merge(m)(action.payload))(state);

      default:
        return state;
    }
  },
};

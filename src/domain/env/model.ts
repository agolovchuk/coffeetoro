import * as A from './actions';
import set from 'lodash/fp/set';
import merge from 'lodash/fp/merge';
import update from 'lodash/fp/update';
import { IEnv } from './Types';
import { Action as UserAction, UPDATE_USER } from 'domain/users';

export const reducer = {
  env(state: IEnv = {} as IEnv, action: A.Action | UserAction) {
    switch (action.type) {

      case A.LOGOUT:
        return set('user')(null)(state);

      case A.LOGIN:
        return set('user')(action.payload)(state);

      case UPDATE_USER:
        return update('user')(m => m.id === action.payload.id ? merge(m)(action.payload) : m)(state);

      case A.UPDATE_FIREBASE_CONFIG:
        return set('firebaseConfig')(action.payload)(state);

      default:
        return state;
    }
  },
};

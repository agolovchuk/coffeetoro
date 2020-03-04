import set from 'lodash/fp/set';
import { UsersState } from './Types';
import * as A from './actions';
import { LOGOUT, Logout } from 'domain/env';

export const reducer = {
  users(state: UsersState = {} as UsersState, action: A.Action | Logout) {
    switch (action.type) {

      case A.CREATE_USER:
        return set(action.payload.id)(action.payload)(state);

      case A.GET_USERS:
        return action.payload;

      case LOGOUT:
        return {};

      default:
        return state;
    }
  },
};

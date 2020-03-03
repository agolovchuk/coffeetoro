import { UsersState } from './Types';
import * as A from './actions';

export const reducer = {
  users(state: UsersState = {} as UsersState, action: A.Action) {
    switch (action.type) {

      case A.getUsersAction.type:
        return action.payload;

      default:
        return state;
    }
  },
};

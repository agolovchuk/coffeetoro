import { ThunkAction } from 'redux-thunk';
import { AppState } from '../StoreType';
import { IUser } from './Types';
import CDB, { promisifyReques } from 'db';
import { pbkdf2Verify } from 'domain/users/helpers'
import * as C from 'db/constants';

export const LOGOUT = 'AUTH/LOGOUT';
export const LOGIN = 'AUTH/LOGIN';

interface Logout {
  type: typeof LOGOUT;
}

function logoutAction(): ThunkAction<void, AppState, unknown, Logout> {
  return async (dispatch, getState) => {
    const dbx = new CDB();
    const { env } = getState();
    try {
      const db = await dbx.open();
      const updateRequest = db
        .transaction(C.TABLE.env.name, C.READ_WRITE)
        .objectStore(C.TABLE.env.name).put({ ...env, user: null });
      await promisifyReques(updateRequest);
      db.close();
    } catch (err) {
      console.warn(err);
    } finally {
      dispatch({
        type: LOGOUT,
      })
    }
  }
};

logoutAction.type = LOGOUT;

interface UserAuth {
  id: string;
  password: string;
  onError: (d: any) => void;
}

interface Login {
  type: typeof LOGIN;
  payload: IUser;
}

function loginAction({ id, password, onError }: UserAuth): ThunkAction<void, AppState, unknown, Login | any> {
  return async(dispatch, getState) => {
    const dbx = new CDB();
    try {
      const db = await dbx.open();
      const checkRequest = db
        .transaction(C.TABLE.users.name)
        .objectStore(C.TABLE.users.name)
        .index(C.TABLE.users.index.id)
        .get(id);
      const { hash, ...user  } = await promisifyReques(checkRequest);
      const res = await pbkdf2Verify(hash, password);
      if (res) {
        const { env } = getState();
        const updateRequest = db
          .transaction(C.TABLE.env.name, C.READ_WRITE)
          .objectStore(C.TABLE.env.name).put({ ...env, user: id });
        await promisifyReques(updateRequest);
        dispatch({ type: LOGIN, payload: user });
      } else {
        onError('Invalid password');
      }
      db.close();
    } catch (err) {
      onError(err);
      console.warn(err);
    }
  }
}

loginAction.type = LOGIN;

export {
  loginAction,
  logoutAction,
}

export type Action = Login | Logout;

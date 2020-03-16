import { ThunkAction } from 'redux-thunk';
import get from'lodash/get';
import { AppState } from '../StoreType';
import { IUser, FirebaseConfig } from './Types';
import CDB, { promisifyReques } from 'db';
import { pbkdf2Verify } from 'domain/users/helpers'
import * as C from 'db/constants';
import { envSelector } from './selectors';

export const LOGOUT = 'AUTH/LOGOUT';
export const LOGIN = 'AUTH/LOGIN';
export const UPDATE_FIREBASE_CONFIG = 'ENV/UPDATE_FIREBASE_CONFIG';

export interface Logout {
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

interface UpdateFirebaseConfig {
  type: typeof UPDATE_FIREBASE_CONFIG;
  payload: FirebaseConfig | null;
}

export function updateFirebaseConfigAction(config: FirebaseConfig | null): ThunkAction<void, AppState, unknown, UpdateFirebaseConfig> {
  return async(dispatch, getState) => {
    const env = envSelector(getState());
    try {
      const idb = new CDB();
      await idb.updateItem(C.TABLE.env.name, {
        ...env,
        user: get(env, ['user', 'id'], null),
        firebaseConfig: config,
      });
      dispatch({
        type: UPDATE_FIREBASE_CONFIG,
        payload: config,
      });
      if (config?.apiKey?.length) {
        window.location.href = '/';
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export {
  loginAction,
  logoutAction,
}

export type Action = Login | Logout | UpdateFirebaseConfig;

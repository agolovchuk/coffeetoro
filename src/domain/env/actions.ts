import get from'lodash/get';
import pick from 'lodash/pick';
import { ThunkAction } from '../StoreType';
import { IUser, FirebaseConfig, ISession } from './Types';
import CDB, { promisifyRequest } from 'db';
import { prepareEnvSession } from './helpers';
import { pbkdf2Verify } from 'domain/users/helpers';
import * as C from 'db/constants';
import { envSelector } from './selectors';
import { DayReportParams } from "../../components/Daily/Types";

export const LOGOUT = 'AUTH/LOGOUT';
export const LOGIN = 'AUTH/LOGIN';
export const UPDATE_FIREBASE_CONFIG = 'ENV/UPDATE_FIREBASE_CONFIG';
export const CLOSE_SESSION = 'ENV/CLOSE_SESSION';

export interface Logout {
  type: typeof LOGOUT;
}

function logoutAction(): ThunkAction<Logout> {
  return async (dispatch, getState) => {
    const idb = new CDB();
    const { env } = getState();
    try {
      const db = await idb.open();
      const updateRequest = db
        .transaction(C.TABLE.env.name, C.READ_WRITE)
        .objectStore(C.TABLE.env.name).put({ ...env, user: null });
      await promisifyRequest(updateRequest);
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
  payload: {
    user: IUser,
    session: ISession,
  };
}

function loginAction({ id, password, onError }: UserAuth): ThunkAction<Login | any> {
  return async(dispatch, getState) => {
    const idb = new CDB();
    try {
      const db = await idb.open();
      const checkRequest = db
        .transaction(C.TABLE.users.name)
        .objectStore(C.TABLE.users.name)
        .index(C.TABLE.users.index.id)
        .get(id);
      const { hash, ...user  } = await promisifyRequest(checkRequest);
      const res = await pbkdf2Verify(hash, password);
      if (res) {

        const env = prepareEnvSession(getState().env, id)

        const updateRequest = db
          .transaction(C.TABLE.env.name, C.READ_WRITE)
          .objectStore(C.TABLE.env.name)
          .put(env);
        await promisifyRequest(updateRequest);

        dispatch({ type: LOGIN, payload: { user, session: env.session } });
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

export function updateFirebaseConfigAction(config: FirebaseConfig | null): ThunkAction<UpdateFirebaseConfig> {
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

interface CloseSession {
  type: typeof CLOSE_SESSION,
  payload: DayReportParams & Omit<ISession, 'end'> & { end: Date } & { userId: string, userName: string } ,
}

export function closeSessionAction(data: DayReportParams, cb: () => void): ThunkAction<CloseSession> {
  return async (dispatch, getState) => {
    const { env: { session, user }} = getState();
    const { id: userId, name: userName } = pick(user, ['id', 'name']);
    dispatch({
      type: CLOSE_SESSION,
      payload: {
        ...data,
        ...session,
        end: new Date(),
        userId,
        userName,
      }
    });
    cb();
  }
}

export {
  loginAction,
  logoutAction,
}

export type Action = Login
  | Logout
  | UpdateFirebaseConfig
  | CloseSession;

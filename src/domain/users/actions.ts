import { ThunkAction } from 'redux-thunk';
import { getId } from 'lib/id';
import { AppState } from '../StoreType';
import CDB from 'db';
import * as C from 'db/constants';
import { pbkdf2, pbkdf2Verify } from './helpers';
import * as adapters from './adapters'
import { User } from './Types';

export const CREATE_USER = 'USERS/CREATE_USER';
export const GET_USERS = 'USERS/GET_USERS';
export const UPDATE_USER = 'USERS/UPDATE_USER';

interface CreateUser {
  type: typeof CREATE_USER;
  payload: User,
}

function createUserAction(data: User, onComplete: (e?: Error) => void): ThunkAction<void, AppState, unknown, CreateUser> {
  return async(dispatch) => {
    try {
      const hash = await pbkdf2('1111');
      const user = { ...data, hash, id: getId(8) };
      const dbx = new CDB();
      await dbx.addItem(C.TABLE.users.name, user);
      dispatch({
        type: CREATE_USER,
        payload: user,
      })
      onComplete();
    } catch (err) {
      onComplete(err);
      console.warn(err);
    }
  }
}

interface GetUsers {
  type: typeof GET_USERS;
  payload: Record<string, User>;
}

function getUsersAction(): ThunkAction<void, AppState, unknown, GetUsers>  {
  return async(dispatch) => {
    try {
      const dbx = new CDB();
      const users = await dbx.getDictionary(C.TABLE.users.name, adapters.usersListAdapter, 'id');
      if (users !== null) {
        dispatch({
          type: GET_USERS,
          payload: users,
        })
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

interface UpdateUser {
  type: typeof UPDATE_USER;
  payload: User;
}

function updateUserAction(data: User, onComplete: (e?: Error) => void): ThunkAction<void, AppState, unknown, UpdateUser> {
  return async (dispatch) => {
    try {
      const dbx = new CDB();
      const db = await dbx.open();
      const transaction = db.transaction(C.TABLE.users.name, C.READ_WRITE);
      transaction.oncomplete = function () { db.close(); }

      const request = transaction
        .objectStore(C.TABLE.users.name)
        .index(C.TABLE.users.index.id)
        .openCursor(data.id);

      request.onsuccess = function() {
        if (this.result) {
          this.result.update({...this.result.value, ...data});
          this.result.continue();
        } else {
          dispatch({ type: UPDATE_USER, payload: data });
          onComplete();
        }
      }
    } catch (err) {
      onComplete(err);
      console.warn(err);
    }
  }
}

interface UpdatePassword {
  id: string,
  old: string;
  password: string;
}

function updatePasswordAction(data: UpdatePassword, onComplete: (e?: Error) => void) {
  return async() => {
    try {
      const dbx = new CDB();
      const eitherUser = await dbx.getItem(C.TABLE.users.name, adapters.userAdapters, data.id, C.TABLE.users.index.id);
      if (eitherUser === null) throw new Error('No user found');
      const { hash, ...user } = eitherUser;
      const isVerify = await pbkdf2Verify(hash, data.old);
      if (!isVerify) throw new Error('Invalsid old password');
      const newHash = await pbkdf2(data.password);
      await dbx.updateItem(C.TABLE.users.name, { ...user, hash: newHash });
      onComplete();
    } catch (err) {
      onComplete(err);
      console.warn(err);
    }
  }
}

export {
  createUserAction,
  getUsersAction,
  updateUserAction,
  updatePasswordAction,
}

export type Action = CreateUser
  | GetUsers
  | UpdateUser
  ;

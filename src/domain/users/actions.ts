import { ThunkAction } from 'redux-thunk';
import { arrayToRecord } from 'lib/dataHelper';
import { getId } from 'lib/id';
import { AppState } from '../StoreType';
import CDB, { promisifyReques } from 'db';
import * as C from 'db/constants';
import { pbkdf2, pbkdf2Verify } from './helpers';
import * as adapters from './adapters'
import { User } from './Types';

const CREATE_USER = 'USERS/CREATE_USER';
const GET_USERS = 'USERS/GET_USERS';
export const UPDATE_USER = 'USERS/UPDATE_USER';

interface CreateUser {
  type: typeof CREATE_USER;
  payload: User,
}

function createUserAction(data: Partial<User>) {
  return async() => {
    const hash = await pbkdf2('1111');
    const user = { hash, ...data, id: getId(8) };
    try {
      const dbx = new CDB();
      const db = await dbx.open();
      const osUser = db.transaction([C.TABLE.users.name], C.READ_WRITE).objectStore(C.TABLE.users.name);
      await promisifyReques(osUser.add(user));
      db.close();
    } catch (err) {
      console.warn(err);
    }
  }
}

createUserAction.type = CREATE_USER;

interface GetUsers {
  type: typeof GET_USERS;
  payload: Record<string, User>;
}

function getUsersAction(): ThunkAction<void, AppState, unknown, GetUsers>  {
  return async(dispatch) => {
    try {
      const dbx = new CDB();
      const db = await dbx.open();
      const users = await promisifyReques<User[]>(db.transaction(C.TABLE.users.name).objectStore(C.TABLE.users.name).getAll());
      db.close();
      dispatch({
        type: GET_USERS,
        payload: arrayToRecord(users, 'name'),
      })
    } catch (err) {
      console.warn(err);
    }
  }
}

getUsersAction.type = GET_USERS;

interface UpdateUser {
  type: typeof UPDATE_USER;
  payload: User;
}

function updateUserAction(data: User): ThunkAction<void, AppState, unknown, UpdateUser> {
  return async (dispatch) => {
    try {
      const dbx = new CDB();
      const db = await dbx.open();
      const request = db.transaction(C.TABLE.users.name, C.READ_WRITE)
        .objectStore(C.TABLE.users.name)
        .index(C.TABLE.users.index.id)
        .openCursor(data.id);
      request.onsuccess = function() {
        if (this.result) {
          this.result.update({...this.result.value, ...data});
          this.result.continue();
        } else {
          dispatch({ type: UPDATE_USER, payload: data });
        }
        db.close();
      }
    } catch (err) {
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
      const eitherUser = await dbx.getItem(C.TABLE.users.name, C.TABLE.users.index.id, data.id, adapters.userAdapters);
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

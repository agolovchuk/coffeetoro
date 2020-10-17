import CDB, { promisifyRequest } from 'db';
import { getId } from 'lib/id';
import * as C from 'db/constants';
import { User } from 'domain/users';
import { IEnv, DBEnv, ISession } from './Types';
import cond from "lodash/cond";
import set from "lodash/fp/set";
import compose from "lodash/fp/compose";

function createNewSession(creator: string): ISession {
  return {
    id: getId(12,'session'),
    start: new Date(),
    creator,
    end: undefined,
  }
}

export function prepareEnvSession(env: IEnv, userId: string): IEnv {
  const condition = cond([
    [(d: IEnv) => (typeof d.session === 'undefined'), set('session')(createNewSession(userId))],
    [() => true, d => d],
  ]);
  return compose(condition, set('user')(userId))(env);
}


export async function getEnv(): Promise<IEnv> {
  const dbx = new CDB();
  const db = await dbx.open();
  let env: IEnv;
  let user: User | null = null;
  const transaction = db.transaction([C.TABLE.env.name, C.TABLE.users.name]);
  const envRequest = transaction.objectStore(C.TABLE.env.name).get('default');
  const userOs = transaction.objectStore(C.TABLE.users.name).index(C.TABLE.users.index.id);
  return new Promise(async(resolve) => {
    transaction.oncomplete = function() {
      if (user) {
        const { hash, ...u } = user;
        resolve({ ...env, user: u });
      } else {
        resolve({ ...env, user: null });
      }
      db.close();
    }
    env = await promisifyRequest<DBEnv>(envRequest);
    if (typeof env.user === 'string') {
      user = await promisifyRequest<User | null>(userOs.get(env.user));
    }
  });
}

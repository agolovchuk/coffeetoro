import CDB, { promisifyRequest } from 'db';
import * as C from 'db/constants';
import { User } from 'domain/users';
import { IEnv, DBEnv } from './Types';

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

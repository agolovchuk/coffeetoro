import {
  Store,
  Reducer,
  combineReducers,
  createStore,
  compose,
  applyMiddleware,
  Middleware,
} from 'redux';
import thunk from 'redux-thunk';
import { AppState } from './StoreType';
import idMiddleware from 'db/middlware';
import { getEnv } from 'domain/env/helpers';

const __DEV__ = (process.env.NODE_ENV === 'development');

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

function getMiddleware(state: boolean): Promise<Middleware<any, AppState, any>[] | []> {
  if (state) {
    return Promise.all([
      import('services/firebase/middleware').then(e => e.default),
    ])
  }
  return Promise.resolve([]);
}

export default async function configureStore(): Promise<Store<AppState>> {

  const initialState = {
    env: await getEnv(),
  } as AppState;

  const mdw = await getMiddleware(initialState.env.firebaseConfig !== null);

  let composeEnhancers = compose;

  if (__DEV__) {
    const devEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof devEnhancers === 'function') {
      composeEnhancers = devEnhancers;
    }
  }

  const reducers: Reducer<AppState> = combineReducers<AppState>({
    ...require('./dictionary').reducer,
    ...require('./env').reducer,
    ...require('./orders').reducer,
    ...require('./users').reducer,
    ...require('./reports').reducer,
  });

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunk,
        idMiddleware(),
        ...mdw,
      ),
    ),
  );

  return store;
}


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
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { AppState } from './StoreType';
import idbMiddlware from 'db/middlware';
// import fbMiddlware from 'services/firebase/middlware';
import { getEnv } from 'domain/env/helpers';

const __DEV__ = (process.env.NODE_ENV === 'development');

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

function getMiddlware(state: boolean): Promise<Middleware<any, AppState, any>[] | []> {
  if (state) {
    return Promise.all([
      import('services/firebase/middlware').then(e => e.default),
    ])
  }
  return Promise.resolve([]);
}

export default async function configureStore(history: History): Promise<Store<AppState>> {

  const initialState = {
    env: await getEnv(),
  } as AppState;

  const mdw = await getMiddlware(initialState.env.firebaseConfig !== null);

  let composeEnhancers = compose;

  if (__DEV__) {
    const devEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof devEnhancers === 'function') {
      composeEnhancers = devEnhancers;
    }
  }

  const reducers: Reducer<AppState> = combineReducers<AppState>({
    router: connectRouter(history),
    ...require('./dictionary').reducer,
    ...require('./env').reducer,
    ...require('./orders').reducer,
    ...require('./users').reducer,
  });

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        idbMiddlware(),
        ...mdw,
      ),
    ),
  );

  return store;
}


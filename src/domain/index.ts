import {
  Store,
  Reducer,
  combineReducers,
  createStore,
  compose,
  applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { AppState } from './StoreType'

const __DEV__ = (process.env.NODE_ENV === 'development');

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export default function configureStore(history: History): Store<AppState> {

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
  });

  const store = createStore(
    reducers,
    composeEnhancers(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
      ),
    ),
  );

  return store;
}


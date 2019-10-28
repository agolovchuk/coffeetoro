import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHashHistory as createHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { HashRouter as RouterProvider } from 'react-router-dom';
import configureStore from './domain';

import './index.css';
import App from './pages';
import * as serviceWorker from './serviceWorker';

const history = createHistory();

const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <RouterProvider>
        <App />
      </RouterProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

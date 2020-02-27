import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHashHistory as createHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { HashRouter as RouterProvider } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import configureStore from './domain';
import { UnitsContext, getValueFromStore } from 'components/Units';

import './index.css';
import App from './pages';
import * as serviceWorker from './serviceWorker';
import 'lib/loger';

const history = createHistory();

const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale="ru-UA">
      <ConnectedRouter history={history}>
        <RouterProvider>
          <UnitsContext.Provider value={getValueFromStore(store)}>
            <App />
          </UnitsContext.Provider>
        </RouterProvider>
      </ConnectedRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

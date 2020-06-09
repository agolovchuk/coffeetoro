import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as RouterProvider } from 'react-router-dom';
import get from 'lodash/get';
import IntlProvider from 'components/Intl';
import configureStore from './domain';
import { UnitsContext, getValueFromStore } from 'components/Units';
import { getMessages, Messages } from 'l10n';

import './index.css';
import App from './pages';
import * as serviceWorker from './serviceWorker';
import 'lib/loger';

async function coffeeToro() {
  const store = await configureStore();
  const lang = get(store.getState(), ['env', 'user', 'lang'], 'en');
  let messages: Messages = {};
  try {
    const m = await getMessages(lang);
    if (typeof m === 'undefined') throw new Error('Cant load Translation from' + lang);
    messages = m;
  } catch (err) {
    console.warn(err);
  } finally {
    ReactDOM.render(
      <Provider store={store}>
        <IntlProvider locale="ru-UA" defaultMessage={messages}>
          <RouterProvider>
            <UnitsContext.Provider value={getValueFromStore(store)}>
              <App />
            </UnitsContext.Provider>
          </RouterProvider>
        </IntlProvider>
      </Provider>,
      document.getElementById('root')
    );
    serviceWorker.register();
  }
}

coffeeToro();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();

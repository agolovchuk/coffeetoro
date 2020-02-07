import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Layouts from './layout';
import OrdersList from './OrdersList';
import CacheBox from './CashBox';
import Auth from './Auth';

export default function App() {
  return (
    <Switch>
      <Route path="/login" exact component={Auth} />
      <Layouts>
        <Switch>
          <Route path="/" component={OrdersList} exact />
          <Route path="/order" component={CacheBox} />
        </Switch>
      </Layouts>
    </Switch>
  );
}
import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layouts from './layout';
import OrdersList from './OrdersList';
import CacheBox from './CashBox';
import Auth from './Auth';
import ManagerRout from 'pages/Managment';
import PNF from './404';

export default function App() {
  return (
    <Switch>
      <Route path="/login" exact component={Auth} />
      <Route path={['/orders', '/order', '/manager']}>
        <Layouts>
          <Switch>
            <Route path="/orders" component={OrdersList} exact />
            <Route path="/order" component={CacheBox} />
            <ManagerRout />
          </Switch>
        </Layouts>
      </Route>
      <Redirect from="/" to="/orders" exact />
      <Route path="*" component={PNF} />
    </Switch>
  );
}

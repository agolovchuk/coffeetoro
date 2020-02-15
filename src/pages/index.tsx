import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { multiplierSelector } from 'domain/env';
import { AppState } from 'domain/StoreType';
import { connect } from 'react-redux';
import Layouts from './layout';
import OrdersList from './OrdersList';
import CacheBox from './CashBox';
import Auth from './Auth';

interface Props {
  multiplier: number;
}

function App({ multiplier }: Props) {
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

const mapStateToProps = (state: AppState) => ({
  multiplier: multiplierSelector(state),
});

export default connect(mapStateToProps)(App);
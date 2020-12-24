import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import List from './list';
import Receipt from './receipt';

function TrialBalance() {
  return (
    <Switch>
      <Route path="/manager/trial-balance/:receiptId" exact component={Receipt} />
      <Route path="/manager/trial-balance" exact component={List} />
    </Switch>
  );
}

export default React.memo(TrialBalance);

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import List from './list';
import Card from './card';

function ProcessCard() {
  return (
    <Switch>
      <Route path="/manager/pc/:pcId" component={Card} />
      <Route path="/manager/pc" exact component={List} />
    </Switch>
  );
}

export default React.memo(ProcessCard);

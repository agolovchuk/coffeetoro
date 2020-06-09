import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import List from './list';
import Card from './card';

function GroupArticles() {
  return (
    <Switch>
      <Route path="/manager/group/:groupId" exact component={Card} />
      <Route path="/manager/group" exact component={List} />
    </Switch>
  );
}

export default React.memo(GroupArticles);

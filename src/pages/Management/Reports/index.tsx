import * as React from "react";
import { match, Switch, Route } from 'react-router-dom';
import Grid from "components/Grid";
import Daily from './daily';
import Consolidated from './consolidated';
import { getLink } from "../helper";

const LIST = [
  {
    id: '0',
    name: 'daily',
    title: 'Daily'
  },
  {
    id: '1',
    name: 'consolidated',
    title: 'Consolidated'
  }
];

interface List {
  id: string;
  name: string;
  title: string;
}

interface Props {
  match: match
}

function Reports({ match }: Props) {
  const createLink = ({ name }: List) => getLink(match.url, name);
  return (
    <Switch>
      <Route path="/manager/reports" exact>
        <Grid
          list={LIST}
          getLink={createLink}
          getKey={e => e.name}
        />
      </Route>
      <Route path={["/manager/reports/daily/:date", "/manager/reports/daily"]} component={Daily} />
      <Route path="/manager/reports/consolidated" component={Consolidated} />
    </Switch>
  )
}

export default React.memo(Reports);

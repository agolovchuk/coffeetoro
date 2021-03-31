import * as React from "react";
import { match, Switch, Route } from 'react-router-dom';
import Grid from "components/Grid";
import Tile from 'components/Tile';
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

interface IList {
  id: string;
  name: string;
  title: string;
}

interface Props {
  match: match
}

function Reports({ match: { url } }: Props) {
  
  const createLink = React.useCallback(({ name }: IList) => getLink(url, name), [url]);

  const createKey = React.useCallback(({ id }: IList) => id, []);

  const tile = React.useCallback((e: IList) => <Tile to={createLink(e)} {...e} />, [createLink])

  return (
    <Switch>
      <Route path="/manager/reports" exact>
        <Grid list={LIST} getKey={createKey}>{tile}</Grid>
      </Route>
      <Route path={["/manager/reports/daily/:date", "/manager/reports/daily"]} component={Daily} />
      <Route path="/manager/reports/consolidated" component={Consolidated} />
    </Switch>
  )
}

export default React.memo(Reports);

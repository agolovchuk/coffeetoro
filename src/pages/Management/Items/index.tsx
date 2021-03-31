import { useCallback, memo } from 'react';
import { match } from 'react-router-dom';
import Grid from 'components/Grid';
import Tile from 'components/Tile';

import { getLink } from '../helper';
import { LIST } from './list';
import { IList } from './Types';

interface Props {
  match: match
}

function ManagementItems({ match: { url } }: Props) {

  const createLink = useCallback(({ name }: IList) => getLink(url, name), [url]);
  const createKey = useCallback(({ name }: IList) => name, []);
  const tile = useCallback((e: IList) => <Tile to={createLink(e)} {...e} />, [createLink]);


  return (
    <div className="scroll-section">
      <Grid list={LIST} getKey={createKey}>{tile}</Grid>
    </div>
  );
}

export default memo(ManagementItems);

import * as React from 'react';
import Tile from 'components/Tile';
import { currentParams } from 'domain/routes/helpers';
import { Params, ParamsNames } from 'domain/routes/Types';
import styles from './grid.module.css';

interface GridItem {
  id: string;
  name: string;
  title: string;
}

interface Props {
  paramsList: ReadonlyArray<ParamsNames>;
  list: ReadonlyArray<GridItem>;
  params: Params;
}

function pathMaker(paramsList: ReadonlyArray<ParamsNames>, params: Params) {
  const path = currentParams(paramsList, params);
  return (postfix: string) => `/${[path.concat(postfix).join('/')]}`;
}

function Grid({ paramsList, list, params }: Props) {
  const path = pathMaker(paramsList, params);
  return (
    <section className={styles.container}>
      {
        list.map(({ id, name, ...rest}) =>
          <Tile key={id.toString()} to={path(name)} {...rest} />
        )
      }
    </section>
  );
}

export default Grid;
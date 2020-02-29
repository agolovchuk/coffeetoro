import * as React from 'react';
import Tile from 'components/Tile';
import styles from './grid.module.css';

interface GridItem {
  title: string;
  name: string;
}

interface Props<T> {
  list: ReadonlyArray<T>;
  getLink: (el: T) => string;
  getKey: (el: T) => string;
}

function Grid<T extends GridItem>({ list, getLink, getKey }: Props<T>) {
  return (
    <section className={styles.container}>
      {
        list.map((e) =>
          <Tile key={getKey(e)} to={getLink(e)} {...e} />
        )
      }
    </section>
  );
}

export default Grid;
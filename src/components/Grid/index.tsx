import * as React from 'react';
import Tile from 'components/Tile';
import styles from './grid.module.css';

interface GridItem {
  id: string;
  title: string;
  name: string;
}

interface Props<T> {
  list: ReadonlyArray<T>;
  getLink: (el: T) => string;
}

function Grid<T extends GridItem>({ list, getLink }: Props<T>) {
  return (
    <section className={styles.container}>
      {
        list.map((e) =>
          <Tile key={e.id.toString()} to={getLink(e)} {...e} />
        )
      }
    </section>
  );
}

export default Grid;
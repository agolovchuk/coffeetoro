import * as React from 'react';
import get from 'lodash/get';
import styles from './list.module.css';

interface Props<T> {
  list: ReadonlyArray<T>,
  getKey: (data: T) => string;
  // orderBy: [string];
  orderBy: (a: T, b: T) => number;
  children: (data: T) => React.ComponentType<T> | React.ReactNode;
}

function ItemList<T>({ list, children, getKey, orderBy }: Props<T>) {

  // const orderedList: Array<T> = React.useMemo(() => sortBy(list, orderBy), [list, orderBy]);
  const orderedList = React.useMemo<ReadonlyArray<T>>(() => list.slice().sort(orderBy), [list, orderBy]);

  return (
    <ul className={styles.list}>
      {
        orderedList.map(e => (
          <li key={getKey(e)} className={styles.item}>
            {
              children(e)
            }
          </li>
        ))
      }
    </ul>
  )
}

interface Ordering {
  title: string;
}

ItemList.defaultProps = {
  orderBy: (a: Ordering, b: Ordering) => get(a, 'title', '').localeCompare(get(b, 'title', '')),
  // orderBy: [(a) => a.title.localeCompare(), 'description'],
}

export default ItemList;

import * as React from 'react';
import styles from './list.module.css';

interface Props<T> {
  list: ReadonlyArray<T>,
  getKey: (data: T) => string;
  children: (data: T) => React.ComponentType<T> | React.ReactNode;
}

function ItemList<T>({ list, children, getKey }: Props<T>) {
  return (
    <React.Fragment>
      {
        list.map(e => (
          <li key={getKey(e)} className={styles.item}>
            {
              children(e)
            }
          </li>
        ))
      }
    </React.Fragment>
  )
}

export default ItemList;
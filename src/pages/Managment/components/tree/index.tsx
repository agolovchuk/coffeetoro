import * as React from 'react';
import styles from './tree.module.css';

interface Leaf {
  name: string;
}

interface Props<T> {
  data: Record<string, T[]>;
  item?: T,
  children: (i?: T) => string | React.ReactNode
  getName: (i?: T) => string
  getKey: (i: T) => string
}

function Item<T>({ item, ...props }: Props<T>) {
  const name = props.getName(item);
  const list = props.data[name];
  return (
    <dl>
      <dt className={styles.header}>{props.children(item)}</dt>
      <dd className={styles.content}>
        {
          list ? (
            <dl>
              {
                list.map(e => ( <Item key={props.getKey(e)} item={e} {...props} /> ))
              }
            </dl>
          ) : null
        }
      </dd>
    </dl>
  )
}

export default Item;
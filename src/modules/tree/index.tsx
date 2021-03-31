import * as React from 'react';
import styles from './tree.module.css';

interface Props<T> {
  data: Record<string, T[]>;
  item?: T,
  children(i?: T): string | JSX.Element
  getName(i?: T): string
  getKey(i?: T): string
}

function Item<T>({ item, ...props }: Props<T>) {

  const name = React.useMemo(() => props.getName(item), [item, props]);

  const list = React.useMemo(() => props.data[name], [props, name]);

  const key = React.useCallback((e?: T) => props.getKey(e), [props]);
 
  return (
    <dl className={styles.container}>
      <dt className={styles.header}>{props.children(item)}</dt>
      <dd className={styles.content}>
        {
          list ? (
            <dl className={styles.container}>
              {
                list.map(e => ( <Item key={key(e)} item={e} {...props} /> ))
              }
            </dl>
          ) : null
        }
      </dd>
    </dl>
  )
}

export default Item;

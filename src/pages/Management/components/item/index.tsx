import * as React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './item.module.css';

interface Props<T> {
  data: T,
  title: string | JSX.Element,
  onEdit(data: T): void;
  getLink: ((data: T) => string) | string;
}

function MItem<T>({ data, onEdit, getLink, title }: Props<T>) {

  const link = React.useMemo(
    () => (typeof getLink === 'function' ? getLink(data) : getLink),
    [getLink, data],
  );

  const tultype = React.useMemo(
    () => (typeof title === 'string' ? title : undefined),
    [title],
  )

  const editHandler = React.useCallback(
    () => onEdit(data),
    [onEdit, data],
  )

  return (
    <div className={styles.container}>
      <NavLink
        to={link}
        className={styles.link}
        activeClassName={styles.active}
        title={tultype}
      >{title}</NavLink>
      <button
        type="button"
        className={cx("btn__edit", styles.btn)}
        onClick={editHandler}
      />
    </div>
  )
}

export default React.memo(MItem);

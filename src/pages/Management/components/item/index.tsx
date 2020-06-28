import * as React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './item.module.css';

type Data = Record<string, any>;

interface Props<T> {
  data: T,
  title: string | React.ReactNode,
  onEdit: (data: T) => void;
  getLink: ((data: T) => string) | string;
}

function MItem<T extends Data>({ data, onEdit, getLink, title }: Props<T>) {
  const link = typeof getLink === 'function' ? getLink(data) : getLink;
  return (
    <div className={styles.container}>
      <NavLink
        to={link}
        className={styles.link}
        activeClassName={styles.active}
        title={typeof title === 'string' ? title : undefined}
      >{title}</NavLink>
      <button
        type="button"
        className={cx("btn__edit", styles.btn)}
        onClick={() => onEdit(data)}
      />
    </div>
  )
}

export default MItem;

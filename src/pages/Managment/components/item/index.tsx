import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './item.module.css';

interface Data {
  title: string
}

interface Props<T> {
  data: T,
  onEdit: (data: T) => void;
  getLink: ((data: T) => string) | string;
}

function MItem<T extends Data>({ data, onEdit, getLink }: Props<T>) {
  const link = typeof getLink === 'function' ? getLink(data) : getLink;
  return (
    <div className={styles.container}>
      <NavLink
        to={link}
        className={styles.link}
        activeClassName={styles.active}
      >{data.title}</NavLink>
      <button
        type="button"
        className="button_edit"
        onClick={() => onEdit(data)}
      />
    </div>
  )
}

export default MItem;

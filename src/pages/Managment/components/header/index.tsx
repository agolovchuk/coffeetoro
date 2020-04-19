import * as React from 'react';
import styles from './header.module.css';

interface Props {
  title: string;
  onCreate?: () => void;
}

function Header({ title, onCreate }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {
        typeof onCreate === 'function' ? (
          <button
            className="btn__add"
            type="button"
            onClick={onCreate}
          />
        ) : null
      }
    </div>
  )
}

export default Header;

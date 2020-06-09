import * as React from 'react';
import cx from 'classnames';
import styles from './header.module.css';

interface Props {
  title: string;
  onCreate?: () => void;
  isSticky?: boolean;
}

function Header({ title, onCreate, isSticky }: Props) {
  return (
    <div className={cx(styles.container, { [styles.sticky]: isSticky })}>
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

import * as React from 'react';
import cx from 'classnames';
import styles from './profile.module.css';

interface Props {
  name: string;
  ava: string;
  className?: string;
}

function Profile({ name, ava, className }: Props) {
  return (
    <section className={cx(className, styles.container)}>
      <button type="button" className={styles.btn}>
        <h3 className={styles.name}>{name}</h3>
        <img src={ava} alt={name} className={styles.ava} />
      </button>
    </section>
  )
}

export default Profile;

import * as React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { IUser } from '../Types';
import styles from './profile.module.css';

interface Props {
  className?: string;
  user: IUser;
}

function Profile({ className, user }: Props) {
  return (
    <section className={cx(className, styles.container)}>
      <Link to="/manager" className={styles.gear} />
      <button type="button" className={styles.btn}>
        <h3 className={styles.name}>{user.nikName}</h3>
        <img src={user.ava} alt={user.nikName} className={styles.ava} />
      </button>
    </section>
  )
}

export default Profile;

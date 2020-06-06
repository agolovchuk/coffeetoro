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
      {
        user.role === 'manager' && (
          <Link to="/manager" className={cx(styles.roundBtn, styles.gear)} />
        )
      }
      <Link to="/user" className={styles.btn}>
        {
          user.ava ? (
            <img src={user.ava} alt={user.name} className={styles.ava} />
          ) : (
            <div className={cx(styles.ava, styles.noava)}>{user.name.slice(0, 1)}</div>
          )
        }
        <h3 className={styles.name}>{user.name}</h3>
      </Link>
      <Link to="/logout" className={cx(styles.roundBtn, styles.logout)} />
    </section>
  )
}

export default Profile;

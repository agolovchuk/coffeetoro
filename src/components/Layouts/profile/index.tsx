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
        user.role === 'manager' && (<Link to="/manager" className={styles.gear} />)
      }
      <Link to="/logout" className={styles.logout} />
      <Link to="/user" className={styles.btn}>
        <h3 className={styles.name}>{user.name}</h3>
        {
          user.ava ? (
            <img src={user.ava} alt={user.name} className={styles.ava} />
          ) : (
            <div className={cx(styles.ava, styles.noava)}>{user.name.slice(0, 1)}</div>
          )
        }
      </Link>
    </section>
  )
}

export default Profile;

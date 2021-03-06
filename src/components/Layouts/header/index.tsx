import * as React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import Profile from '../profile';
import { IUser } from '../Types';
import styles from './header.module.css';

interface Props {
  onBack: () => void;
  location: {
    pathname: string;
  };
  user: IUser | null;
}

function Header({ onBack, location, user }: Props) {

  const [isFS, setFS] = React.useState(document.fullscreen);

  const handleEvent = React.useCallback(() => { setFS(document.fullscreen); }, []);

  const handleFullScreen =  React.useCallback(() => {
    if (document.fullscreen === true) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen){
      document.documentElement.requestFullscreen();
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', handleEvent);
    return () => {
      document.removeEventListener('fullscreenchange', handleEvent);
    }
  }, [handleEvent]);

  return (
    <header className={styles.container}>
      <button
        type="button"
        className={cx(styles.btn, styles.back)}
        onClick={onBack}
        disabled={location.pathname === '/orders'}
      />
      <NavLink
        to="/orders"
        exact
        className={cx(styles.btn, styles.orders)}
        activeClassName={styles.active}
      />
      <button
        className={cx(styles.btn, styles.roundBtn, styles.fullscreen, {[styles.isfs]: isFS })}
        onClick={handleFullScreen}
        type="button"
      />
      <NavLink
        to="/expense"
        exact
        className={cx(styles.btn, styles.roundBtn, styles.expense)}
        activeClassName={styles.active}
      />
      <NavLink
        to="/report"
        exact
        className={cx(styles.btn, styles.roundBtn, styles.report)}
        activeClassName={styles.active}
      />
      {
        user && (
          <Profile
            className={styles.profile}
            user={user}
          />
        )
      }
    </header>
  )
}

export default Header;

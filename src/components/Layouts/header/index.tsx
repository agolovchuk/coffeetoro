import * as React from 'react';
import Profile from '../profile';
import { IUser } from '../Types';
import styles from './header.module.css';

interface Props {
  onBack: () => void;
  location: {
    pathname: string;
  };
  user: IUser;
}

function Header({ onBack, location, user }: Props) {
  return (
    <header className={styles.container}>
      <button
        type="button"
        className={styles.back}
        onClick={onBack}
        disabled={location.pathname === '/'}
      />
      <Profile
        className={styles.profile}
        user={user}
      />
    </header>
  )
}

export default Header;
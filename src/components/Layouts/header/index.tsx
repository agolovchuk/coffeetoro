import * as React from 'react';
import Profile from '../profile';
import styles from './header.module.css';

interface Props {
  onBack: () => void;
  location: {
    pathname: string;
  };
  name?: string;
  ava?: string;
}

function Header({ onBack, location }: Props) {
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
        name="Max"
        ava="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
      />
    </header>
  )
}

export default Header;
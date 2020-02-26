import * as React from 'react';
import Header from './header';
import styles from './layout.module.css';
import { IUser } from './Types';

interface ILocation {
  pathname: string;
}

interface Props {
  children: React.ReactNode;
  onBack: () => void;
  location: ILocation;
  user: IUser;
}

function Layout({ children, ...props}: Props) {
  return (
    <div className={styles.container}>
      <Header {...props} />
      <main className={styles.content}>{children}</main>
    </div>
  )
}

export default Layout;
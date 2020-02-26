import * as React from 'react';
import styles from './header.module.css';

interface Props {
  title: string;
  onCreate: () => void;
}

function Header({ title, onCreate }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <button
        className="button_add"
        type="button"
        onClick={onCreate} />
    </div>
  )
}

export default Header;
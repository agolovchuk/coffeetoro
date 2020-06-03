import * as React from "react";
import styles from './header.module.css';

interface Props {
  title: string | React.ReactNode;
}

function PopupHeader({ title }: Props) {
  return (
    <h2 className={styles.title}>{title}</h2>
  )
}

export default PopupHeader;

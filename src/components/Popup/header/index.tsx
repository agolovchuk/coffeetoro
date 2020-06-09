import * as React from "react";
import cx from 'classnames';
import styles from './header.module.css';

interface Props {
  title: string | React.ReactNode;
  className?: string;
}

function PopupHeader({ title, className }: Props) {
  return (
    <h2 className={cx(styles.title, className)}>{title}</h2>
  )
}

export default PopupHeader;

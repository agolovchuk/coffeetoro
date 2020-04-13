import * as React from 'react';
import cx from 'classnames';
import styles from './field.module.css';

interface Props {
  children: React.ReactNode
  id: string;
  title: string;
  labelClassName?: string;
}

function Field({ children, id, title, labelClassName }: Props) {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={cx(styles.label, labelClassName)}>{title}</label>
      {
        children
      }
    </div>
  )
}

export default Field;

import * as React from 'react';
import styles from './field.module.css';

interface Props {
  children: React.ReactNode
  id: string;
  title: string;
}

function Field({ children, id, title }: Props) {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>{title}</label>
      {
        children
      }
    </div>
  )
}

export default Field;

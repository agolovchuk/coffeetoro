import * as React from 'react';
import cx from 'classnames';
import styles from './confirmation.module.css';

interface Props {
  title: string | React.ReactNode;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

function Confirmation({ title, children, onConfirm, onCancel }: Props) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {
        children
      }
      <div className={styles.btnGroup}>
        <button
          type="button"
          className={cx(styles.btn, styles.cancel)}
          onClick={onCancel}
        >Cancel</button>
        <button
          type="button"
          className={cx(styles.btn, styles.ok)}
          onClick={onConfirm}
        >Ok</button>
      </div>
    </section>
  )
}

export default Confirmation;

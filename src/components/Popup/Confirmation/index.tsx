import * as React from 'react';
import cx from 'classnames';
import PopupHeader from '../header';
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
      <PopupHeader title={title} />
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

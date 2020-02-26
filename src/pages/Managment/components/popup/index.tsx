import * as React from 'react';
import cx from 'classnames';
import { Form } from 'react-final-form';
import { Modal, Popup } from 'components/Popup';
import styles from './popup.module.css';

interface Props<T extends Record<string, any>> {
  title: string | React.ReactNode;
  onCancel: () => void;
  children: React.ReactNode;
  initialValues: T,
  onSubmit: (value: T) => void;
}

function ManagmentPopup<T>({ title, onCancel, children, initialValues, onSubmit }: Props<T>) {
  return (
    <Modal>
      <Popup onCancel={onCancel}>
        <div className={styles.popup}>
          <div className={styles.header}>{title}</div>
          <div className={styles.form}>
            <Form
              onSubmit={onSubmit}
              initialValues={initialValues}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  {
                    children
                  }
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      className={cx(styles.btn, styles.cancel)}
                      onClick={onCancel}
                    >Cancel</button>
                    <button
                      type="submit"
                      className={cx(styles.btn, styles.ok )}
                    >Ok</button>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </Popup>
    </Modal>
  )
}

export default ManagmentPopup;

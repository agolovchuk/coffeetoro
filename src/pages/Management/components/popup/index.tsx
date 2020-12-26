import * as React from 'react';
import cx from 'classnames';
import { Form } from 'react-final-form';
import { Modal, Popup } from 'components/Popup';
import styles from './popup.module.css';
import { Decorator } from 'final-form';

interface Props<T extends Record<string, any>> {
  title: string | React.ReactNode;
  onCancel: () => void;
  children: React.ReactNode;
  initialValues: T,
  onSubmit: (value: T) => void;
  decorators?: Decorator<T>[];
  validate?: () => Record<string, string>;
}

function ManagementPopup<T>({ title, onCancel, children, initialValues, onSubmit, decorators, validate }: Props<T>) {
  return (
    <Modal>
      <Popup onCancel={onCancel}>
        <div className={styles.popup}>
          <div className={styles.header}>{title}</div>
          <div className={styles.form}>
            <Form
              onSubmit={onSubmit}
              initialValues={initialValues}
              validate={validate}
              decorators={decorators}
              render={({ handleSubmit, submitting }) => (
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
                      disabled={submitting}
                      className={cx(styles.btn, styles.ok)}
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

export default ManagementPopup;

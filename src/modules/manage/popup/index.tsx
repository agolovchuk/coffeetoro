import * as React from 'react';
import { ValidationErrors } from 'final-form';
import { Form } from 'react-final-form';
import { Modal, Popup } from 'components/Popup';
import styles from './popup.module.scss';
import { Decorator } from 'final-form';
import useElement from "./useElement";

interface Props<T extends Record<string, any>> {
  title: string | React.ReactNode;
  onCancel: () => void;
  children: React.ReactNode;
  initialValues: T,
  onSubmit: (value: T) => void;
  decorators?: Decorator<T>[];
  validate?: (d: T) => (ValidationErrors | Promise<ValidationErrors>);
}

function ManagementPopup<T>({ title, onCancel, children, initialValues, onSubmit, decorators, validate }: Props<T>) {

  const { form } = useElement({ children, onCancel, styles });

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
              render={form}
            />
          </div>
        </div>
      </Popup>
    </Modal>
  )
}

export default ManagementPopup;

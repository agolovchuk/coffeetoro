import * as React from 'react';
import Field from './field';
import styles from './checkbox.module.css';

interface Props {
  id: string;
  title: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled?: boolean;
}

function CheckBox({ id, title, ...props }: Props) {
  return (
    <Field id={id} title={title}>
      <div className={styles.container}>
        <input disabled={props.disabled} type="checkbox" id={id} className={styles.field} {...props} />
        <label htmlFor={id} className={styles.label} />
      </div>
    </Field>
  )
}

export default CheckBox;

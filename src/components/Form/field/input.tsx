import * as React from 'react';
import styles from './field.module.css';
import Field from './field';

interface Props<T extends HTMLElement = HTMLElement> {
  id: string;
  title: string;
  name: string;
  onBlur: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus: (event?: React.FocusEvent<T>) => void;
  type?: string;
  value: string;
  checked?: boolean;
  multiple?: boolean;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
}

function InputField({ id, title, ...rest }: Props) {
  return (
    <Field id={id} title={title}>
      <input id={id} {...rest} className={styles.field} />
    </Field>
  )
}

export default InputField;

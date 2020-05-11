import * as React from 'react';
import cx from 'classnames';
import styles from './field.module.css';
import Field from './field';

interface Props<T extends HTMLElement = HTMLElement> {
  id: string;
  title: string;
  name: string;
  onBlur?: (event?: React.FocusEvent<T>) => void;
  onChange?: (event: React.ChangeEvent<T> | any) => void;
  onFocus?: (event?: React.FocusEvent<T>) => void;
  type?: string;
  value: string;
  checked?: boolean;
  multiple?: boolean;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  readOnly?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
}

function InputField({ id, title, labelClassName, containerClassName, inputClassName, ...rest }: Props) {
  return (
    <Field
      id={id}
      title={title}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
    >
      <input id={id} {...rest} className={cx(styles.field, inputClassName)} />
    </Field>
  );
}

export default InputField;

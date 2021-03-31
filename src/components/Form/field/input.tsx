import * as React from 'react';
import cx from 'classnames';
import { format } from 'date-fns';
import { FieldMetaState } from 'react-final-form';
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
  value: string | Date;
  checked?: boolean;
  multiple?: boolean;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  readOnly?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  meta?: FieldMetaState<string | undefined>;
}

function InputField({ id, title, labelClassName, containerClassName, inputClassName, value, meta, ...rest }: Props) {
  const v = (value instanceof Date) ? format(value, 'yyyy-MM-dd') : value;
  return (
    <Field
      id={id}
      title={title}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
    >
      <input
        id={id}
        {...rest}
        value={v}
        className={cx(styles.field, {[styles.error]: meta?.error }, inputClassName)}
      />
    </Field>
  );
}

export default InputField;

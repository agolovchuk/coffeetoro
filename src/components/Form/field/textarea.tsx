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
  value: string | Date;
  multiple?: boolean;
  readOnly?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
}

function TextAreaField({ id, title, labelClassName, containerClassName, inputClassName, value, ...rest }: Props) {
  return (
    <Field
      id={id}
      title={title}
      labelClassName={labelClassName}
      containerClassName={cx(styles.textareaContainer, containerClassName)}
    >
      <textarea id={id} {...rest} className={cx(styles.textarea, inputClassName)} />
    </Field>
  );
}

export default TextAreaField;

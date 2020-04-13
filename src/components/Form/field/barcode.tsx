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
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  onComplete?: (term: string) => void
}

function InputField({ id, title, onComplete, ...rest }: Props) {

  const handleKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if(e.keyCode === 13 && typeof onComplete === 'function') {
        e.preventDefault();
        e.stopPropagation();
        onComplete(rest.value);
      }
    }, [onComplete, rest.value],
  );

  return (
    <Field id={id} title={title}>
      <input
        id={id}
        {...rest}
        className={styles.field}
        inputMode="none"
        onKeyDown={handleKey}
      />
    </Field>
  )
}

export default InputField;

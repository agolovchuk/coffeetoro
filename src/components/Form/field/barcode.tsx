import * as React from 'react';
import cx from 'classnames';
import styles from './field.module.css';
import Field from './field';

type MetaField = {
  error: string;
  touched?: boolean;
}

interface Meta extends MetaField {}

interface Props<T extends HTMLElement = HTMLElement> {
  id: string;
  title: string;
  name: string;
  onBlur?: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus?: (event?: React.FocusEvent<T>) => void;
  type?: string;
  value: string;
  checked?: boolean;
  multiple?: boolean;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  onComplete?: (term: string) => void;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  meta: Meta;
}

const InputField = React.forwardRef(({ id, title, inputClassName, labelClassName, onComplete, containerClassName, children, ...rest }: Props, ref: any) => {
  const { error, touched } = rest.meta;

  const isError = React.useMemo(() => (error && touched), [error, touched]);

  const handleKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if(e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onComplete === 'function') onComplete(rest.value);
      }
    }, [onComplete, rest.value],
  );

  return (
    <Field
      id={id}
      title={title}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
    >
      <input
        id={id}
        ref={ref}
        {...rest}
        className={cx(styles.field, inputClassName, { [styles.error]: isError })}
        inputMode="none"
        onKeyDown={handleKey}
      />
      {
        children
      }
    </Field>
  );
})

export default InputField;

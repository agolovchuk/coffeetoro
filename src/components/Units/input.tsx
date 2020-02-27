import * as React from 'react'

const VALID_STRING = /^\d+\.?\d{0,2}$/;

interface Props {
  multiplier: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  id?: string;
}

function changeDot(v: string) {
  return v.replace(',', '.');
}

function Input({ multiplier, value, onChange, className, ...props }: Props) {

  const [displayValue, setDisplayValue] = React.useState((value / multiplier).toString());

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const v = changeDot(e.target.value);
      const numberValue = Number.parseFloat(v);
      if (!isNaN(numberValue) && VALID_STRING.test(v)) {
        setDisplayValue(v);
        onChange(numberValue * multiplier);
      }
      return;
    }, [onChange, multiplier]
  );

  const handleKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      const { keyCode } = e;
      const { selectionStart, selectionEnd } = e.currentTarget;
      const { length } = displayValue;
      if (selectionStart === 0 && selectionEnd === length && keyCode === 8) {
        setDisplayValue('');
        onChange(0);
      }
      if (selectionStart === 1 && selectionStart === selectionEnd && keyCode === 8) {
        setDisplayValue('');
        onChange(0);
      }
    }, [displayValue, onChange]
  )

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      className={className}
      onChange={handleChange}
      value={displayValue}
      onKeyDown={handleKey}
    />
  )
}

export default React.memo(Input);
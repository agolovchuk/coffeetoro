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

function isBackSpace(keyCode: number) {
  return (keyCode === 8 || keyCode === 229);
}

function Input({ multiplier = 1, value, onChange, className, ...props }: Props) {

  const regexp = React.useMemo(() => {
    if (multiplier === 1) return /^\d+$/;
    return VALID_STRING;
  }, [multiplier])

  const [displayValue, setDisplayValue] = React.useState((value / multiplier).toString());

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const v = changeDot(e.target.value);
      const numberValue = Number.parseFloat(v);
      if (!isNaN(numberValue) && regexp.test(v)) {
        setDisplayValue(v);
        onChange(numberValue * multiplier);
      }
      return;
    }, [onChange, multiplier, regexp]
  );

  const handleKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      const { keyCode } = e;
      const { selectionStart, selectionEnd } = e.currentTarget;
      const { length } = displayValue;
      if (selectionStart === 0 && selectionEnd === length && isBackSpace(keyCode)) {
        setDisplayValue('');
        onChange(0);
      }
      if (selectionStart === 1 && selectionStart === selectionEnd && isBackSpace(keyCode)) {
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

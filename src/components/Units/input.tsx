import * as React from 'react'
import UnitsContext from './helpers';

interface Props {
  className?: string;
  value: number;
  onChange: (value: number) => void;
  id?: string;
  max?: number;
}

const VALID_STRING = /^\d+\.?\d{0,2}$/;
const multiplier = 1000; // TODO:

function changeDot(v: string) {
  return v.replace(',', '.');
}

export default function MoneyInput({
  max = Number.MAX_SAFE_INTEGER,
  className,
  value,
  onChange,
  ...props
}: Props) {

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
    }, [onChange]
  )

  return (
    <UnitsContext.Consumer>
      {
        () => (
          <input
            {...props}
            type="text"
            inputMode="decimal"
            className={className}
            onChange={handleChange}
            value={displayValue}
          />
        )
      }
    </UnitsContext.Consumer>
  )
}

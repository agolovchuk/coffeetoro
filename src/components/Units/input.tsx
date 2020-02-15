import * as React from 'react'
import compose from 'lodash/fp/compose';
import UnitsContext from './helpers';

interface Props {
  className?: string;
  value: number;
  onChange: (value: number) => void;
}

function parseNumber(value: string): number {
  const v = parseFloat(value);
  if (isNaN(v)) return 0;
  return v;
}
function changeHandler(adapter: (v: number) => number, setter: (v: number) => void) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    compose(
      setter,
      adapter,
      parseNumber,
    )(value);
  }
}

export default function MoneyInput({ className, value, onChange }: Props) {
  return (
    <UnitsContext.Consumer>
      {
        data => (
          <input
            type="text"
            pattern="/b"
            value={data.getPrice(value)}
            onChange={changeHandler(data.toInnerMoney, onChange)}
            className={className}
          />
        )
      }
    </UnitsContext.Consumer>
  )
}

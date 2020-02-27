import * as React from 'react'
import UnitsContext from './helpers';
import Input from './input';

interface Props {
  className?: string;
  value: number;
  onChange: (value: number) => void;
  id?: string;
  max?: number;
}


export default function MoneyInput({ max = Number.MAX_SAFE_INTEGER, ...props}: Props) {

  return (
    <UnitsContext.Consumer>
      {
        (data) => (
          <Input {...props} multiplier={data.multiplier} />
        )
      }
    </UnitsContext.Consumer>
  )
}

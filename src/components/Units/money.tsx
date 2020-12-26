import * as React from 'react'
import UnitsContext from './helpers';
import Input from 'components/Form/Decimal';

interface Props {
  className?: string;
  value: number;
  onChange: (value: number) => void;
  id?: string;
  max?: number;
}

export default function MoneyInput({ max = Number.MAX_SAFE_INTEGER, ...props }: Props) {
  const data = React.useContext(UnitsContext);
  return (
    <Input {...props} multiplier={data.multiplier} />
  )
}

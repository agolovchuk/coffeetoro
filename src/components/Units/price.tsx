import * as React from 'react';
import { useIntl } from 'react-intl';
import UnitsContext from './helpers';

interface PriceProps {
  value: number;
  sign?: boolean;
  notation?: 'standard' | 'compact',
  currencyDisplay?: 'symbol' | 'code' | 'narrowSymbol' | 'name';
}

export default function Price({ value, sign, currencyDisplay, notation }: PriceProps) {

  const { currency, getPrice } = React.useContext(UnitsContext);

  const { formatNumber } = useIntl();

  const result = formatNumber(getPrice(value), {
    compactDisplay: "short",
    currencyDisplay,
    currencySign: "standard",
    notation,
    style: sign ? 'currency' : 'unit',
    currency,
  });

  return (
    <React.Fragment>{result}</React.Fragment>
  );
}

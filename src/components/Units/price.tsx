import * as React from 'react';
import { FormattedNumber } from 'react-intl';
import UnitsContext from './helpers';

interface PriceProps {
  value: number;
  sign?: boolean;
  notation?: 'standard' | 'compact',
  currencyDisplay?: 'symbol' | 'code' | 'narrowSymbol' | 'name';
}

export default function Price({ value, sign, currencyDisplay, notation }: PriceProps) {
  return (
    <UnitsContext.Consumer>
      {
        data => (
        <FormattedNumber
          value={data.getPrice(value)}
          compactDisplay="short"
          currencyDisplay={currencyDisplay}
          currencySign="standard"
          notation={notation}
          style={sign ? 'currency' : 'unit'} // eslint-disable-line react/style-prop-object
          currency={data.currency}
        >
          {
            (c: string) => c
          }
        </FormattedNumber>
        )
      }
    </UnitsContext.Consumer>
  )
}

import * as React from 'react';
import { FormattedNumber } from 'react-intl';
import UnitsContext from './helpers';

interface PriceProps {
  value: number;
  sign?: boolean;
  notation?: 'standard' | 'compact',
}

export default function Price({ value, sign, notation }: PriceProps) {
  return (
    <UnitsContext.Consumer>
      {
        data => (
        <FormattedNumber
          value={data.getPrice(value)}
          compactDisplay="short"
          currencyDisplay="narrowSymbol"
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
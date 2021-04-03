import * as React from 'react';
import cx from 'classnames';
import { Title } from '../title';
import styles from './cash.module.css';
import { Price, MoneyInput } from 'components/Units';

interface Props {
  onBack: () => void;
  valuation: number;
}

export default function PaymentCash({ onBack, valuation }: Props) {
  const [customer, setCustomerMoney] = React.useState(0);
  return (
    <section className={cx(styles.frame, styles.cache)}>
      <Title
        onBack={onBack}
        title="Наличные"
      />
      <div className={styles.content}>
        <dl className={styles.line}>
          <dt>К оплате:</dt>
          <dd>
            <Price value={valuation} sign notation="compact" currencyDisplay="narrowSymbol" />
          </dd>
        </dl>
        <dl className={styles.line}>
          <dt>Покупатель:</dt>
          <dd>
            <MoneyInput
              value={customer}
              onChange={setCustomerMoney}
              className={styles.input}
            />
          </dd>
        </dl>
        <dl className={cx(styles.line, styles.result)}>
          <dt>Сдача:</dt>
          <dd>
            <Price
              value={customer - valuation}
              sign
              notation="compact"
              currencyDisplay="narrowSymbol"
            />
          </dd>
        </dl>
      </div>
    </section>
  )
}

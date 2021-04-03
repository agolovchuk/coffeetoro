import { useMemo } from "react";
import cx from 'classnames';
import get from 'lodash/get';
import { PaymentCash } from '../cach';
import { Title } from '../title';
import { IUseElementsProps, IAccounts } from './Types';
import styles from './methods.module.scss'

export default function useElements({ valuation, onCancel, method, accounts }: IUseElementsProps) {

  const accountById = useMemo(
    () => accounts.reduce(
      (a, v) => ({ ...a, [v.id]: v }),
      {} as Record<string, IAccounts>
    ),
    [accounts],
  )

  const cashMethods = useMemo(
    () => (
      <PaymentCash
        onBack={onCancel}
        valuation={valuation}
      />
    ),
    [onCancel, valuation],
  );

  const cashLessMethod = useMemo(
    () => (
      <section className={cx(styles.frame, styles.bank)}>
        <Title
          onBack={onCancel}
          title="Банковская карта"
        />
      </section>
    ),
    [onCancel],
  );

  const selectedMethod = useMemo(
    () => get(accountById, [method, 'cashLess']) ? cashLessMethod : cashMethods,
    [accountById, method, cashLessMethod, cashMethods],
  );

  return {
    cashMethods,
    cashLessMethod,
    selectedMethod,
  }
}

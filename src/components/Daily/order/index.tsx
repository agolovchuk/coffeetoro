import * as React from "react";
import { format } from 'date-fns';
import cx from 'classnames';
import { summa } from 'lib/decimal';
import { Price } from "components/Units";
import Item from "../item";
import { DiscountItem } from 'domain/orders/Types';
import styles from './order.module.css';

interface Props {
  date: string;
  payment: 1 | 2;
  discounts?: ReadonlyArray<DiscountItem>;
  items: ReadonlyArray<{
    title: string;
    id: string;
    description?: string;
    valuation: number;
    quantity: number;
  }>;
}

function Order({ items, date, payment, discounts }: Props) {

  const sm = React.useMemo(() => summa(items), [items])

  return (
    <li className={styles.item}>
      <dl className={styles.params}>
        <dt>Время:</dt>
        <dd>{format(new Date(date), 'HH:mm')}</dd>
      </dl>
      <dl className={styles.params}>
        <dt>Сумма:</dt>
        <dd>
          <Price
            value={sm}
            sign
            notation="compact"
            currencyDisplay="narrowSymbol"
          />
        </dd>
      </dl>
      {
        discounts ? (
          <dl className={cx(styles.params, styles.discount)}>
            <dt>Скидка:</dt>
            <dd>
              <Price
                value={summa(discounts)}
                sign
                notation="compact"
                currencyDisplay="narrowSymbol"
              />
            </dd>
          </dl>
        ) : null
      }
      <dl className={styles.params}>
        <dt>Оплата:</dt>
        <dd>{payment === 2 ? 'Банк' : 'Касса'}</dd>
      </dl>
      <ul className={styles.articles}>
        {
          items.map(e => (
            <Item key={e.id} {...e} />
          ))
        }
      </ul>

    </li>
  )
}

export default Order;

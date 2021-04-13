import * as React from "react";
import { format } from 'date-fns';
import cx from 'classnames';
import get from 'lodash/get';
import { summa } from 'lib/decimal';
import { Price } from "components/Units";
import Item from "../item";
import { IAccountItem, IOrderItem, DiscountItem } from '../Types';
import styles from './order.module.css';

interface Props {
  date: string;
  payment: string;
  discounts?: ReadonlyArray<DiscountItem>;
  accounts: Record<string, IAccountItem>;
  items: ReadonlyArray<IOrderItem>;
}

function Order({ items, date, payment, accounts, discounts }: Props) {

  const sm = React.useMemo(() => summa(items), [items]);

  const formattedDate = React.useMemo(() => format(new Date(date), 'HH:mm'), [date]);

  return (
    <li className={styles.item}>
      <dl className={styles.params}>
        <dt>Время:</dt>
        <dd>{formattedDate}</dd>
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
        <dd>{get(accounts, [payment, 'name'], '')}</dd>
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

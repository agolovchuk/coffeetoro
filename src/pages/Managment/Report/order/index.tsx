import * as React from "react";
import { format } from 'date-fns';
import { Price } from "components/Units";
import Item from "../item";
import { getSumOfOrder } from 'domain/orders/helpers';
import styles from './order.module.css';

interface Props {
  date: string;
  payment: 1 | 2;
  items: ReadonlyArray<{
    title: string;
    id: string;
    description?: string;
    valuation: number;
    quantity: number;
  }>;
}

function Order({ items, date, payment }: Props) {
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
            value={getSumOfOrder(items)}
            sign
            notation="compact"
            currencyDisplay="narrowSymbol"
          />
        </dd>
      </dl>
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

import * as React from 'react';
import Item from './item';
import styles from './order.module.css';
import { OrderItemContainer } from './Types';

interface Props {
  list: ReadonlyArray<OrderItemContainer>,
  onComplete: () => void,
}

function getSumm(list: ReadonlyArray<OrderItemContainer>): number {
  return list.reduce((a, v) => a + (v.price.valuation * v.quantity), 0);
}

function Order({ list, onComplete }: Props) {
  const summ = getSumm(list);
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {
          list.map(data =>
            <Item
              key={data.product.name + data.volume.name}
              onRemove={() => null}
              {...data}
            />
          )
        }
      </ul>
      <div className={styles.footer}>
        <dl className={styles.summ}>
          <dt>Итого:</dt>
          <dd>{summ}</dd>
        </dl>
        <button
          type="button"
          onClick={onComplete}
          className={styles.btn}
        >Оплатить</button>
      </div>
    </section>
  )
}

export default Order;

import * as React from 'react';
import Item from './item';
import styles from './order.module.css';
import { OrderItemContainer } from './Types';
import { Price } from 'components/Units';
import { PaymentMethod } from 'domain/orders/Types';
import Payment from './payment';

interface Props {
  orderId: string,
  list: ReadonlyArray<OrderItemContainer>,
  onComplete: (method: PaymentMethod) => void,
}

function getSumm(list: ReadonlyArray<OrderItemContainer>): number {
  return list.reduce((a, v) => a + (v.price.valuation * v.quantity), 0);
}

function makeUrl(orderId: string) {
  return ({categoryName, name }: Partial<OrderItemContainer["product"]>) =>
    `/order/${orderId}/${categoryName}/product/${name}`;
}

function Order({ list, onComplete, orderId }: Props) {
  const summ = getSumm(list);
  const [isPiced, picMethod] = React.useState(false);
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {
          list.map(data =>
            <Item
              key={data.product.name + data.volume.name}
              onRemove={() => null}
              url={makeUrl(orderId)(data.product)}
              {...data}
            />
          )
        }
      </ul>
      <div className={styles.footer}>
        <dl className={styles.summ}>
          <dt>Итого:</dt>
          <dd><Price value={summ} sign /></dd>
        </dl>
        <button
          type="button"
          onClick={() => picMethod(true)}
          className={styles.btn}
        >Оплатить</button>
      </div>
      {
        isPiced ? (
          <Payment
            onCancel={() => picMethod(false)}
            valuation={summ}
            onConplete={onComplete}
          />
        ) : null
      }
    </section>
  )
}

export default Order;

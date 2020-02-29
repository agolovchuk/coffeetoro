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
  return ({ name }: Partial<OrderItemContainer["category"]>) =>
    ['/order', orderId, name, 'product'].join('/');
}

function Order({ list, onComplete, orderId }: Props) {
  const amount = getSumm(list);
  const [isPiced, picMethod] = React.useState(false);
  const getUrl = React.useMemo(() => makeUrl(orderId), [orderId]);
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {
          list.map(data =>
            <Item
              key={data.category.name + data.volume.name}
              onRemove={() => null}
              url={getUrl(data.category)}
              {...data}
            />
          )
        }
      </ul>
      <div className={styles.footer}>
        <dl className={styles.amount}>
          <dt>Итого: <b>{list.length}</b> позиций</dt>
          <dd><Price value={amount} sign /></dd>
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
            valuation={amount}
            onConplete={onComplete}
          />
        ) : null
      }
    </section>
  )
}

export default Order;

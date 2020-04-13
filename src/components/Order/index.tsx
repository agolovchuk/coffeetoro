import * as React from 'react';
import { Price } from 'components/Units';
import BarCode from 'components/Form/BarCode';
import { PaymentMethod } from 'domain/orders/Types';
import Item from './item';
import Payment from './payment';
import styles from './order.module.css';
import { OrderItemContainer } from './Types';

interface Props {
  orderId: string;
  list: ReadonlyArray<OrderItemContainer>;
  onComplete: (method: PaymentMethod) => void;
  onFastAdd: (barcode: string, cb: (r: boolean) => void) => void;
}

function getSumm(list: ReadonlyArray<OrderItemContainer>): number {
  return list.reduce((a, v) => a + (v.price.valuation * v.quantity), 0);
}

function makeUrl(orderId: string) {
  return (id: string) =>
    ['/order', orderId, id, 'product'].join('/');
}

function Order({ list, onComplete, orderId, onFastAdd }: Props) {
  const amount = getSumm(list);
  const [isPiced, picMethod] = React.useState(false);
  const getUrl = React.useMemo(() => makeUrl(orderId), [orderId]);
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {
          list.map(data =>
            <Item
              key={data.price.id}
              onRemove={() => null}
              url={getUrl(data.price.parentId)}
              {...data}
            />
          )
        }
      </ul>
      <div className={styles.footer}>
        <BarCode onComplete={onFastAdd} />
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

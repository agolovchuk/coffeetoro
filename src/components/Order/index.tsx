import * as React from 'react';
import { Price } from 'components/Units';
import BarCode from 'components/Form/BarCode';
import { PaymentMethod } from 'domain/orders/Types';
import { summa } from 'lib/decimal';
import Item from './item';
import Payment from './payment';
import styles from './order.module.css';
import { OrderItemContainer, DiscountItem } from './Types';
import DiscountPopup from "./discountPopup";
import Discount from "./discountItem";

interface Props {
  orderId: string;
  list: ReadonlyArray<OrderItemContainer>;
  onComplete: (method: PaymentMethod.Opened | string) => void;
  onFastAdd: (barcode: string, cb: (r: boolean) => void) => void;
  onAddDiscount: (data: DiscountItem, cb: () => void) => void;
  discounts: ReadonlyArray<DiscountItem>;
  onRemoveDiscount: (id: string) => void;
}

function getSumm(list: ReadonlyArray<OrderItemContainer>, ds: ReadonlyArray<DiscountItem>): number {
  const discount = summa(ds);
  const order = list.reduce((a, v) => a + (v.price.valuation * v.quantity), 0);
  return Math.max(order - discount, 0)
}

function makeUrl(orderId: string) {
  return (id: string) =>
    ['/order', orderId, id, 'product'].join('/');
}

function Order({ list, onComplete, orderId, onFastAdd, onAddDiscount, discounts, onRemoveDiscount }: Props) {
  const amount = getSumm(list, discounts);
  const [isPicked, picMethod] = React.useState(false);
  const [isDiscount, picDiscount] = React.useState(false);
  const getUrl = React.useMemo(() => makeUrl(orderId), [orderId]);

  const handleDiscount = React.useCallback((item) => {
    onAddDiscount(item, () => { picDiscount(false); });
  }, [onAddDiscount]);

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
        {
          discounts.map(data => (
            <Discount key={data.discountId} onRemove={onRemoveDiscount} {...data} />
          ))
        }
      </ul>
      <div className={styles.footer}>
        <BarCode onComplete={onFastAdd} />
        <dl className={styles.amount}>
          <dt className={styles.top}>
            <button
              className={styles.discount}
              onClick={() => picDiscount(true)}
              type="button">скидка</button>
            <div>Итого: <b>{list.length}</b> позиций</div>
          </dt>
          <dd><Price value={amount} sign /></dd>
        </dl>
        <button
          type="button"
          onClick={() => picMethod(true)}
          className={styles.btn}
        >Оплатить</button>
      </div>
      {
        isPicked ? (
          <Payment
            onCancel={() => picMethod(false)}
            valuation={amount}
            onComplete={onComplete}
          />
        ) : null
      }
      {
        isDiscount ? (
          <DiscountPopup
            onAddDiscount={handleDiscount}
            orderId={orderId}
            onCancel={() => picDiscount(false)}
          />
        ) : null
      }
    </section>
  )
}

export default Order;

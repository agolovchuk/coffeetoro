import * as React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { Price } from 'components/Units';
import styles from './item.module.css';
import { OrderItemContainer, OrderApi } from '../Types';

type Props = OrderApi & OrderItemContainer & {
  url: string;
};

function OrderItem({ product, quantity, volume, price, onRemove, url }: Props) {
  return (
    <li className={styles.container}>
      <NavLink
        to={url}
        activeClassName={styles.active}
        className={cx(styles.link, styles.wrapper)}
      >
        <h3 className={styles.title}>{product.title}
          <span className={styles.volume}>{volume.title}</span>
        </h3>
        <div className={styles.summary}>
          <span>
            <span className={styles.quantity}>{quantity}</span> x 
            <span className={styles.valuation}>
              <Price
                value={price.valuation}
                sign
                notation="compact"
                currencyDisplay="narrowSymbol"
              />
            </span>
          </span>
          <span className={styles.summ}>
            <Price
              value={quantity * price.valuation}
              sign
              notation="compact"
              currencyDisplay="narrowSymbol"
            />
          </span>
        </div>
      </NavLink>
    </li>
  );
}

export default OrderItem;

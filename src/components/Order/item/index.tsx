import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './item.module.css';
import { OrderItemContainer, OrderApi } from '../Types';

type Props = OrderApi & OrderItemContainer;

function OrderItem({ product, quantity, volume, price, onRemove }: Props) {
  return (
    <li className={styles.container}>
      <NavLink
        to={`/drink/${product.categoryName}/${product.name}`}
        activeClassName={styles.active}
        className={styles.link}
      >
        <h3 className={styles.title}>{product.title}
          <span className={styles.volume}>{volume.title}</span>
        </h3>
        <div className={styles.summary}>{quantity} x {price.valuation}
          <span className={styles.summ}>{quantity * price.valuation}</span>
        </div>
      </NavLink>
    </li>
  );
}

export default OrderItem;

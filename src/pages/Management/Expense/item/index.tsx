import * as React from 'react';
import { format } from 'date-fns';
import get from 'lodash/get';
import cx from 'classnames';
import { ExpenseExtended } from 'domain/dictionary/Types';
import Price from "components/Units/price";
import { getTitle } from '../../helper';
import styles from './item.module.css';

function Item({ valuation, date, type, ...props }: ExpenseExtended) {
  return (
    <div className={cx(styles.container, styles[type])}>
      <span className={styles.date}>{format(date, 'dd.MM.yyyy')}</span>
      {
        type === 'remittance' ? (
          <span className={styles.title}>{props.about}</span>
        ) : null
      }
      {
        (type === 'service' || type === 'product') ? (
          <span className={styles.title}>{
            getTitle({
              title: get(props, 'title'),
              description: get(props, 'description'),
            })
          }</span>
        ) : null
      }
      {
        'quantity' in props ? (
          <span  className={styles.quantity}>{props.quantity}</span>
        ) : null
      }
      <span  className={styles.valuation}><Price value={valuation} sign /></span>
      <span  className={styles.sum}><Price value={get(props, 'quantity', 1) * valuation} sign /></span>
    </div>
  )
}

export default Item;

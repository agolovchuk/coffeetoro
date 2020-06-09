import * as React from 'react';
import { format } from 'date-fns';
import { ExpenseExtended } from 'domain/dictionary/Types';
import Price from "components/Units/price";
import { getTitle } from '../../helper';
import styles from './item.module.css';

function Item({ title, description, valuation, quantity, date }: ExpenseExtended) {
  return (
    <div className={styles.container}>
      <span className={styles.date}>{format(date, 'dd.MM.yyyy')}</span>
      <span className={styles.title}>{getTitle({ title, description })}</span>
      <span  className={styles.quantity}>{quantity}</span>
      <span  className={styles.valuation}><Price value={valuation} sign /></span>
      <span  className={styles.sum}><Price value={quantity * valuation} sign /></span>
    </div>
  )
}

export default Item;

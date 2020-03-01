import * as React from 'react';
import nanoid from 'nanoid';
import cx from 'classnames';
import { Price } from 'components/Units';
import styles from './valuation.module.css';

interface IPrice {
  id: string;
  valuation: number;
}

interface Props {
  price: IPrice;
  volume: string;
  checked: boolean;
  onChange: (priceId: string) => void,
  inOrder: boolean;
}

export default function Valuation({ volume, price, ...props }: Props) {
  const changeHandler = () => props.onChange(price.id);
  const id = nanoid(5);
  return (
    <li className={styles.item}>
      <input
        id={id}
        name={id + "valuation"}
        type="radio"
        value={volume}
        checked={props.checked}
        onChange={changeHandler}
        className={styles.input}
      />
      <label htmlFor={id} className={cx(styles.label, {[styles.order]: props.inOrder })}>
        <div className={styles.price}>
          <Price value={price.valuation} sign notation="compact" />
        </div>
        <div className={styles.unit}>{volume}</div>
      </label>
    </li>
  );
}
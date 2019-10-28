import * as React from 'react';
import cx from 'classnames';
import { quantify, valueNormalize, maybyRemove } from './helper';
import styles from './quantity.module.css';

interface Props {
  quantity: number;
  onChange: (q: number) => void;
  onRemove: () => void;
}

function Quantity({ quantity, onChange, onRemove }: Props) {
  const clickHandler = (m: number) => quantify(quantity, m, onChange);
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => onChange(valueNormalize(e.currentTarget.value))
  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={clickHandler(-1)}
        className={cx(styles.btn, styles.minus)}
      />
      <input
        type="text"
        pattern="\b"
        value={quantity}
        onChange={changeHandler}
        className={styles.field}
        onBlur={maybyRemove(quantity, onRemove)}
      />
      <button
        type="button"
        onClick={clickHandler(1)}
        className={cx(styles.btn, styles.plus)}
      />
      <button
        type="button"
        className={styles.remove}
        onClick={onRemove}
      />
    </div>
  )
}

export default Quantity;
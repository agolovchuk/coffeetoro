import * as React from 'react';
import cx from 'classnames';
import { quantify } from './helper';
import styles from './quantity.module.css';

interface Props {
  quantity: number;
  onChange: (q: number) => void;
  onRemove: () => void;
}

function Quantity({ quantity, onChange }: Props) {
  const clickHandler = (m: number) => quantify(quantity, m, onChange);

  const changeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const v = Number(value);
      if (isNaN(v)) return;
      if (v === 0) return;
      onChange(v);
    }, [onChange],
  );

  return (
    <div
      className={styles.container}
    >
      <button
        type="button"
        onClick={clickHandler(-1)}
        className={cx(styles.btn, styles.minus)}
      />
      <input
        type="text"
        inputMode="numeric"
        value={quantity}
        onChange={changeHandler}
        className={styles.field}
      />
      <button
        type="button"
        onClick={clickHandler(1)}
        className={cx(styles.btn, styles.plus)}
      />
    </div>
  )
}

export default React.memo(Quantity);
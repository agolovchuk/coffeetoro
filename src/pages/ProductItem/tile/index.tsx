import { memo, Fragment, useCallback, useMemo } from 'react';
import cx from 'classnames';
import { Price } from "components/Units";
import { Article } from '../Types';
import styles from './tile.module.css';

function Tile({ price, onChange }: Pick<Article, 'price'> & { onChange(d: string): void}) {

  const clickHandler = useCallback(() => onChange(price.id), [onChange, price]);

  const isProcessCard = useMemo(() => price.type === 'pc', [price]);

  const btnStyle = useMemo(() => cx(styles.btn, { [styles.isTunable]: isProcessCard }), [isProcessCard]);

  return (
    <Fragment>
      <button
        className={btnStyle}
        onClick={clickHandler}
      >
        <h3 className={styles.title}>{price.title}</h3>
        <div className={styles.price}>
          <Price value={price.valuation} sign notation="compact" />
        </div>
        <div>{price.description}</div>
      </button>
      {
        isProcessCard ? (
          <button
            className={cx('btn__tune', styles.tune)}
            type="button"
          />
        ) : null
      }
    </Fragment>
  )
}

export default memo(Tile);
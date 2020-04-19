import * as React from 'react';
import cx from 'classnames';
import { Article } from './Type';
import styles from './list.module.css';
import { Price } from "components/Units";

interface Props {
  valuation: ReadonlyArray<Article>;
  onChange: (id: string) => void;
}

function List({ valuation, onChange }: Props) {
  return (
    <ul className="grid__container">
      {
        valuation.map(e => (
          <li
            key={e.price.id}
            className={cx('grid__item', 'tile__container', styles.tile)}
          >
            <button className={styles.btn} onClick={() => onChange(e.price.id)}>
              <h3 className={styles.title}>{e.price.title}</h3>
              <div className={styles.price}>
                <Price value={e.price.valuation} sign notation="compact" />
              </div>
              <div>{e.price.description}</div>
            </button>
            {
              e.price.type === 'pc' ? (
                <button
                  className={cx('btn__tune', styles.tune)}
                />
              ) : null
            }
          </li>
        ))
      }
    </ul>
  );
}

export default React.memo(List);

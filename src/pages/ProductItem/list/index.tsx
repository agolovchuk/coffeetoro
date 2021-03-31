import * as React from 'react';
import cx from 'classnames';
import sortBy from 'lodash/sortBy';
import { Article } from '../Types';
import styles from './list.module.css';
import Tile from '../tile';

interface Props {
  valuation: ReadonlyArray<Article>;
  onChange: (id: string) => void;
}

function List({ valuation, onChange }: Props) {

  const list = React.useMemo(
    () => sortBy(valuation, ['price.title', 'price.description']),
    [valuation],
  );

  return (
    <ul className="grid__container">
      {
        list.map(e => (
          <li
            key={e.price.id}
            className={cx('grid__item', styles.tile)}
          >
            <Tile onChange={onChange} price={e.price} />
          </li>
        ))
      }
    </ul>
  );
}

export default React.memo(List);

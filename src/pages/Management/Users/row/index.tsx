import { useMemo } from 'react';
import cx from 'classnames';
import MItem from '../../components/item';
import styles from './row.module.css';

interface Props {
  data: any;
  handleEdit: (d: any) => void;
}

const Row = ({ data, handleEdit }: Props) => {

  const title = useMemo(
    () => <div className={cx(styles.item, {[styles.disabled]: data.active === false })}>{data.name}</div>,
    [data],
  );

  const link = useMemo(() => ['/manager', 'users', data.id].join('/'), [data]);

  return (
    <MItem data={data} onEdit={handleEdit} title={title} getLink={link} />
  );
}

export default Row;

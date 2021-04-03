import { useMemo } from 'react';
import cx from 'classnames';
import MItem from 'modules/manage/item';
import styles from './row.module.css';

interface Props {
  data: any;
  handleEdit: (d: any) => void;
  prefix: string[],
}

const Row = ({ data, handleEdit, prefix }: Props) => {

  const title = useMemo(
    () => <div className={cx(styles.item, {[styles.disabled]: data.active === false })}>{data.name}</div>,
    [data],
  );

  const link = useMemo(() => [...prefix, data.id].join('/'), [data, prefix]);

  return (
    <MItem data={data} onEdit={handleEdit} title={title} getLink={link} />
  );
}

export default Row;

import { useMemo } from 'react';
import MItem from '../../../../modules/manage/item';
import { getTitle } from "../../helper";
import styles from './row.module.css';

interface Props {
  data: any;
  handleEdit: (d: any) => void;
}

const Row = ({ data, handleEdit }: Props) => {

  const title = useMemo(() => <div className={styles.title}>{getTitle(data)}</div>, [data]);

  const createLink = useMemo(() => ['/manager', 'services', data.id].join('/'), [data]);

  return (
    <MItem data={data} onEdit={handleEdit} title={title} getLink={createLink} />
  );
}

export default Row;

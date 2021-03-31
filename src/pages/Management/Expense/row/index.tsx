import { useMemo } from 'react';
import MItem from '../../components/item';
import Item from '../item';

interface Props {
  data: any;
  handleEdit: (d: any) => void;
}

const Row = ({ data, handleEdit }: Props) => {

  const title = useMemo(() => <Item {...data} />, [data]);

  return (
    <MItem data={data} onEdit={handleEdit} title={title} getLink="/" />
  );
}

export default Row;

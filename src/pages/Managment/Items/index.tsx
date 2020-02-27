import * as React from 'react';
import { match } from 'react-router-dom';
import Grid from 'components/Grid';
import { getLink } from '../helper';

interface List {
  id: string;
  name: string;
  title: string;
}

interface Props {
  match: match
}

const LIST: List[] = [
  {
    id: '00',
    name: 'maintenance',
    title: 'Maintenance',
  },
  {
    id: '0',
    name: 'users',
    title: 'Users',
  },
  {
    id: '1',
    name: 'category',
    title: 'Category...'
  }
]

function ManagmentItems({ match }: Props) {
  const createLink = ({ name }: List) => getLink(match.url, name);
  return (
    <Grid
      list={LIST}
      getLink={createLink}
    />
  );
}

export default ManagmentItems;
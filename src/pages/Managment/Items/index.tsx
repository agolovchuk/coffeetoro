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
    name: 'config',
    title: 'System Config',
  },
  {
    id: '01',
    name: 'maintenance',
    title: 'Maintenance',
  },
  {
    id: '02',
    name: 'users',
    title: 'Users',
  },
  {
    id: '03',
    name: 'articles',
    title: 'Articles'
  },
  {
    id: '04',
    name: 'group',
    title: 'Group Articles'
  },
  {
    id: '05',
    name: 'pc',
    title: 'Process Card'
  },
  {
    id: '06',
    name: 'category',
    title: 'Category...'
  },
  {
    id: '07',
    name: 'incoming-balances',
    title: 'Incoming Balances'
  },
  {
    id: '08',
    name: 'incoming',
    title: 'Incoming'
  },
  {
    id: '09',
    name: 'expense',
    title: 'Expense'
  }
];

function ManagementItems({ match }: Props) {
  const createLink = ({ name }: List) => getLink(match.url, name);
  return (
    <Grid
      list={LIST}
      getLink={createLink}
      getKey={e => e.name}
    />
  );
}

export default ManagementItems;

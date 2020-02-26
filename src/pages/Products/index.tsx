import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AppState } from 'domain/StoreType';
import { productsSelector, CRUD } from 'domain/dictionary';
import { PropsMatch } from 'domain/routes';
import Grid from 'components/Grid';

interface IProductItem {
  id: string;
  title: string;
  name: string;
}

type PropsFromRouter = PropsMatch<{orderId: string, category: string}>;

const mapState = (state: AppState, props: PropsFromRouter) => ({
  products: productsSelector(state, props),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {}

function Products({ products, match: { params, url }, getDictionary }: Props) {

  const getLink = React.useCallback((item: IProductItem) => [url, item.name].join('/'), [url])

  React.useEffect(() => {
    getDictionary('products', params.category, 'categoryName');
  }, [params.category, getDictionary]);

  return (
    <Grid
      list={products}
      getLink={getLink}
    />
  );
}

export default connector(Products);

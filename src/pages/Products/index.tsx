import * as React from 'react';
import { connect } from 'react-redux';
import { productsSelector, DictionaryState } from 'domain/dictionary';
import { PropsMatch } from 'domain/routes';
import Grid from 'components/Grid';

interface IProductItem {
  id: string;
  title: string;
  name: string;
}

interface Props extends PropsMatch {
  products: ReadonlyArray<IProductItem>;
}

function pathMaker({ url }: any) {
  return (item: IProductItem) => {
    return [url, item.name].join('/')
  }
}

function Products({ products, match }: Props) {
  const getLink = pathMaker(match);
  return (
    <Grid
      list={products}
      getLink={getLink}
    />
  );
}

const mapStateToProps = (state: DictionaryState, props: Props) => ({
  products: productsSelector(state, props),
});

export default connect(mapStateToProps)(Products);

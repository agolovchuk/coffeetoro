import * as React from 'react';
import { connect } from 'react-redux';
import { productsSelector, DictionaryState } from 'domain/dictionary';
import { PARAMS_LIST, PropsMatch } from 'domain/routes';
import Grid from 'components/Grid';

interface Props extends PropsMatch {
  products: Array<any>;
}

function Products({ products, match }: Props) {
  return (
    <Grid params={match.params} list={products} paramsList={PARAMS_LIST} />
  )
}

const mapStateToProps = (state: DictionaryState, props: Props) => ({
  products: productsSelector(state, props),
});

export default connect(mapStateToProps)(Products);

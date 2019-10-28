import * as React from 'react';
import { connect } from 'react-redux';
import { currentCategorySelector, DictionaryState } from 'domain/dictionary';
import { PARAMS_LIST, PropsMatch } from 'domain/routes';
import Grid from 'components/Grid';

interface Props extends PropsMatch {
  categories: Array<any>,
}

function Categories({ categories, match: { params } }: Props) {
  return (
    <Grid list={categories} params={params} paramsList={PARAMS_LIST} />
  );
}

const mapStateToProps = (state: DictionaryState, props: Props) => ({
  categories: currentCategorySelector(state, props),
});

export default connect(mapStateToProps)(Categories);
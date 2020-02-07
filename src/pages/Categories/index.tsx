import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router-dom';
import { currentCategorySelector, DictionaryState } from 'domain/dictionary';
import Grid from 'components/Grid';

interface ICategoryItem {
  name: string;
  id: string;
  title: string;
  productsNest: boolean;
}

interface ICategoryMatch {
  readonly orderId: string;
  readonly category?: string;
}

interface Props {
  categories: Array<ICategoryItem>;
  match: match<ICategoryMatch>;
}

function pathMaker({ url }: match<ICategoryMatch>) {
  return (item: ICategoryItem) => {
    if (item.productsNest) return [url, item.name, 'product'].join('/');
    return [url, item.name].join('/')
  }
}

function Categories({ categories, match }: Props) {
  const getLink = pathMaker(match);
  return (
    <Grid
      list={categories}
      getLink={getLink}
    />
  );
}

const mapStateToProps = (state: DictionaryState, props: Props) => ({
  categories: currentCategorySelector(state, props),
});

export default connect(mapStateToProps)(Categories);
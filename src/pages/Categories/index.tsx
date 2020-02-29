import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { currentCategoriesSelector, getCategoriesAction, CategoryItem } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import Grid from 'components/Grid';

interface ICategoryMatch {
  readonly orderId: string;
  readonly category?: string;
}

interface PropsFromRouter {
  match: match<ICategoryMatch>;
}

const mapState = (state: AppState, props: PropsFromRouter) => ({
  categories: currentCategoriesSelector(state, props),
});

const mapDispatch = {
  getCategories: getCategoriesAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {};

function pathMaker(orderId: string) {
  const make = (...args: string[]) => ['/order', orderId, ...args].join('/');
  return (item: CategoryItem) => {
    if (item.count) return make(item.name, 'product');
    return make(item.name);
  }
}

function Categories({ categories, match, getCategories }: Props) {

  const { params: { category, orderId } } = match;

  React.useEffect(() => {
    getCategories('parentName', category || 'root');
  }, [category, getCategories]);

  const getLink = React.useMemo(() => pathMaker(orderId), [orderId]);

  return (
    <Grid
      list={categories}
      getKey={e => e.name}
      getLink={getLink}
    />
  );
}

export default connector(Categories);
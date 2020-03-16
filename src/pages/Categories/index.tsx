import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { currentCategoriesSelector, getCategoriesAction, CategoryItem } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import Grid from 'components/Grid';

interface ICategoryMatch {
  readonly orderId: string;
  readonly categoryId?: string;
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
    if (item.count) return make(item.id, 'product');
    return make(item.id);
  }
}

function Categories({ categories, match, getCategories }: Props) {

  const { params: { categoryId, orderId } } = match;

  React.useEffect(() => {
    getCategories('parentId', categoryId || 'root');
  }, [categoryId, getCategories]);

  const getLink = React.useMemo(() => pathMaker(orderId), [orderId]);

  return (
    <Grid
      list={categories}
      getKey={e => e.id}
      getLink={getLink}
    />
  );
}

export default connector(Categories);
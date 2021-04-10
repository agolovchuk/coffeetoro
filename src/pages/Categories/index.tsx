import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { CountedCategoryItem, currentCategoriesSelector, getPriceCategoriesAction, EGroupName } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import Grid from 'components/Grid';
import Tile from 'components/Tile';

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
  getCategories: getPriceCategoriesAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {}

function pathMaker(orderId: string) {
  const make = (...args: string[]) => ['/order', orderId, ...args].join('/');
  return (item: CountedCategoryItem) => {
    if (item.count) return make(item.id, 'product');
    return make(item.id);
  }
}

function Categories({ categories, match, getCategories }: Props) {

  const { params: { categoryId, orderId } } = match;

  React.useEffect(() => {
    getCategories('parentId', categoryId || EGroupName.PRICES);
  }, [categoryId, getCategories]);

  const getLink = React.useMemo(() => pathMaker(orderId), [orderId]);

  const getKey = React.useCallback((e) => e.id, []);

  const tile = React.useCallback((e: CountedCategoryItem) => <Tile to={getLink(e)} {...e} />, [getLink]);

  return (
    <div className="scroll-section">
      <Grid list={categories} getKey={getKey}>{tile}</ Grid>
    </div>
  );
}

export default connector(Categories);

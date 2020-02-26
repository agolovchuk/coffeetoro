import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { categoriesListSelector, CRUD } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import Grid from 'components/Grid';

interface ICategoryItem {
  name: string;
  id: string;
  title: string;
}

interface ICategoryMatch {
  readonly orderId: string;
  readonly category?: string;
}

interface PropsFromRouter {
  match: match<ICategoryMatch>;
}

const mapState = (state: AppState) => ({
  categories: categoriesListSelector(state),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {};

function pathMaker({ url }: match<ICategoryMatch>) {
  return (item: ICategoryItem) => {
    return [url, item.name, 'product'].join('/')
  }
}

function Categories({ categories, getDictionary, match, ...props }: Props) {

  React.useEffect(() => {
    getDictionary('categories');
  }, [getDictionary]);

  const getLink = pathMaker(match);
  return (
    <Grid
      list={categories}
      getLink={getLink}
    />
  );
}

export default connector(Categories);
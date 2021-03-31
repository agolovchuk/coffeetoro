import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, match } from 'react-router-dom';
import { Field } from 'react-final-form';
import groupBy from 'lodash/groupBy'
import {
  CRUD,
  categoriesListSelector,
  updateCategory,
  CountedCategoryItem,
  getPriceCategoriesAction,
  createCategoryAction,
  categoryByNameSelector,
} from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { InputField, SelectField } from 'components/Form/field';
import { ManagementPopup } from '../components';
import Price from './price'
import Tree from 'modules/tree';
import { EGroupName, useItem } from 'modules/category';
import { getParentsList, getParents } from 'modules/category/helpers';
import styles from './category.module.css';

const mapState = (state: AppState) => ({
  categories: categoriesListSelector(state),
  categoryByName: categoryByNameSelector(state),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  create: createCategoryAction,
  update: updateCategory,
  getCategories: getPriceCategoriesAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  match: match<{category?: string}>;
}

function ProductManager({ categories, getCategories, update, create, categoryByName, ...props }: Props) {
  const { params: { category } } = props.match;

  const createLink = React.useCallback(
    ({ id }: CountedCategoryItem) => ['/manager', 'category', id].join('/'),
    [],
  );

  const group = React.useMemo(() => groupBy(categories, 'parentId'), [categories]);

  const { row, item, clearItem, onEdit } = useItem({
    category,
    categoryByName,
    categories,
    createLink,
    update,
    create,
    groupName: EGroupName.PRICES,
  });

  React.useEffect(() => { getCategories('name'); }, [getCategories]);

  const optionList = React.useMemo(
    () => getParentsList(categories, group),
    [categories, group],
  );

  const getKey = React.useMemo(() => getParents(categories), [categories]);

  const name = React.useCallback((e: CountedCategoryItem) => e ? e.id : 'root', []);

  return (
    <div className={styles.container}>
      <section className={styles.column}>
        <div className={styles.view}>
          <Tree data={group} getName={name} getKey={getKey}>{row}</Tree>
        </div>
      </section>
      <Route path="/manager/category/:categoryId" component={Price} />
      {
        item !== null ? (
          <ManagementPopup
            title="Категория"
            onCancel={clearItem}
            onSubmit={onEdit}
            initialValues={item}
          >
            <React.Fragment>
              <Field name="parentId" render={({ input, meta }) => (
                <SelectField
                  list={optionList(item.id)}
                  id="parentId"
                  title="Родитель:"
                  {...input}
                />
              )}/>
              <Field name="title" render={({ input, meta }) => (
                <InputField id="title" title="Имя:" {...input} />
              )}/>
              <Field name="name" render={({ input, meta }) => (
                <InputField id="name" title="Slug:" {...input} />
              )}/>
            </React.Fragment>
          </ManagementPopup>
        ) : null
      }
    </div>
  )
}

export default connector(ProductManager);

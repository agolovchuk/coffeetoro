import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field } from 'react-final-form';
import groupBy from 'lodash/groupBy'
import {
  CRUD,
  categoriesListSelector,
  updateCategory,
  CategoryItem,
  getCategoriesAction,
  createCategoryAction,
  categoryByNameSelector,
} from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { InputField, SelectField } from 'components/Form/field';
import ManagementPopup from 'modules/managmentPopup';
import Tree from 'modules/tree';
import { getParentsList, getParents } from './helpers';
import useItem from './useItem';
import { EGroupName } from './Types';
import styles from './category.module.css';

const mapState = (state: AppState) => ({
  categories: categoriesListSelector(state),
  categoryByName: categoryByNameSelector(state),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  create: createCategoryAction,
  update: updateCategory,
  getCategories: getCategoriesAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  category?: string;
  children: JSX.Element;
  groupName: EGroupName;
  createLink(c: CategoryItem): string;
}

function CategoryManager({
  categories,
  getCategories,
  update,
  create,
  categoryByName,
  groupName,
  category,
  createLink,
  ...props
}: Props) {

  const { row, item, clearItem, onEdit } = useItem({
    category,
    categoryByName,
    categories,
    createLink,
    create,
    update,
    groupName,
  });

  const group = React.useMemo(() => groupBy(categories, 'parentId'), [categories]);

  React.useEffect(() => {
    getCategories('group', groupName);
  }, [getCategories, groupName]);

  const optionList = React.useMemo(() => getParentsList(categories, group, groupName), [categories, group, groupName]);

  const getKey = React.useMemo(() => getParents(categories), [categories]);

  const name = React.useCallback(e => e ? e.id : groupName, [groupName]);

  return (
    <div className={styles.container}>
      <section className={styles.column}>
        <div className={styles.view}>
          <Tree data={group} getName={name} getKey={getKey}>{row}</Tree>
        </div>
      </section>
      {
        props.children
      }
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

export default connector(CategoryManager);

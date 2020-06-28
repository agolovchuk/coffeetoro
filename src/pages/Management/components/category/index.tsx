import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field } from 'react-final-form';
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'
import {
  CRUD,
  categoriesListSelector,
  updateCategory,
  CategoryItem,
  CountedCategoryItem,
  getCategoriesAction,
  createCategoryAction,
  categoryByNameSelector,
} from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { InputField, SelectField } from 'components/Form/field';
import { getId } from 'lib/id';
import { ManagementPopup, MItem, Header } from '../index';
import Tree from '../tree';
import { getMax } from '../../helper';
import { EitherEdit } from '../../Types';
import styles from './category.module.css';
import { getParents } from '../../category/helpers';
import { getParentsList } from './helpers';

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

function createItem(group: string = 'price', sortIndex: number = 0, parentId: string = 'root'): CountedCategoryItem {
  return {
    id: getId(10),
    name: '',
    title: '',
    sortIndex,
    parentId,
    count: 0,
    group,
  }
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type EitherCategory = EitherEdit<CountedCategoryItem>;

interface Props extends PropsFromRedux {
  category?: string;
  children: React.ReactNode;
  groupName: string;
  createLink(c: CategoryItem): string;
}

function CategoryManager({ categories, getCategories, update, create, categoryByName, groupName, category, ...props }: Props) {

  const [item, setItem] = React.useState<EitherCategory | null>(null);

  const edit = React.useCallback(
    ({ isEdit, ...value }: EitherCategory) => {
      if (isEdit) {
        update(value)
      } else {
        create(value);
      }
      setItem(null);
    }, [update, create],
  );

  const group = React.useMemo(() => groupBy(categories, 'parentId'), [categories]);

  React.useEffect(() => {
    getCategories('group', groupName);
  }, [getCategories, groupName]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const optionList = React.useMemo(() => getParentsList(categories, group, groupName), [categories]);

  const getKey = React.useMemo(() => getParents(categories), [categories])

  const createCategory = React.useCallback(() => {
    const categoryId = category ? get(categoryByName, [category, 'id']) : groupName;
    const cat = createItem(groupName, getMax(categories) + 1, categoryId);
    setItem(cat);
  }, [category, categories, categoryByName, groupName]);

  return (
    <div className={styles.container}>
      <section className={styles.column}>
        <div className={styles.view}>
          <Tree
            data={group}
            getName={e => e ? e.id : groupName}
            getKey={getKey}
          >
            {
              (data) => data ? (
                <MItem
                  data={data}
                  title={data.title}
                  getLink={props.createLink}
                  onEdit={(value) => setItem({ ...value, isEdit: true })}
                />
              ) : (
                <Header
                  title="Категории"
                  onCreate={createCategory}
                />
              )
            }
          </Tree>
        </div>
      </section>
      {
        props.children
      }
      {
        item !== null ? (
          <ManagementPopup
            title="Категория"
            onCancel={() => setItem(null)}
            onSubmit={edit}
            initialValues={item}
          >
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
          </ManagementPopup>
        ) : null
      }
    </div>
  )
}

export default connector(CategoryManager);

import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, match } from 'react-router-dom';
import { Field } from 'react-final-form';
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'
import createDecorator from "final-form-calculate";
import { Decorator } from 'final-form';
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
import { ManagmentPopup, MItem, Header } from '../components';
import Price from './price'
import Tree from '../components/tree';
import { getMax } from '../helper';
import { EitherEdit } from '../Types';
import styles from './category.module.css';
import { translite } from "lib/commonHelpers";
import { getPrentsList, getParents } from './helpers';

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

function createItem(sortIndex: number = 0, parentId: string = 'root'): CountedCategoryItem {
  return {
    id: getId(10),
    name: '',
    title: '',
    sortIndex,
    parentId,
    count: 0,
  }
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type EitherCategory = EitherEdit<CountedCategoryItem>;

interface Props extends PropsFromRedux {
  match: match<{category?: string}>;
}

const guessSlag = createDecorator({
  field: 'title',
  updates: {
    name: (v: string) => translite(v || ''),
  }
}) as Decorator<CountedCategoryItem>;

function ProductManager({ categories, getCategories, update, create, categoryByName, ...props }: Props) {
  const { params } = props.match;
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

  const createLink = ({ id }: CategoryItem) => ['/manager', 'category', id].join('/');

  const group = React.useMemo(() => groupBy(categories, 'parentId'), [categories]);

  React.useEffect(() => { getCategories('name'); }, [getCategories]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const optionList = React.useMemo(() => getPrentsList(categories, group), [categories]);

  const getKey = React.useMemo(() => getParents(categories), [categories])

  const createCategory = React.useCallback(() => {
    const categoryId = params.category ? get(categoryByName, [params.category, 'id']) : undefined;
    const cat = createItem(getMax(categories) + 1, categoryId);
    setItem(cat);
  }, [params, categories, categoryByName]);

  return (
    <div className={styles.container}>
      <section className={styles.column}>
        <div className={styles.view}>
          <Tree
            data={group}
            getName={e => e ? e.id : 'root'}
            getKey={getKey}
          >
            {
              (data) => data ? (
                <MItem
                  data={data}
                  title={data.title}
                  getLink={createLink}
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
      <Route path="/manager/category/:categoryId" component={Price} />
      {
        item !== null ? (
          <ManagmentPopup
            title="Категория"
            onCancel={() => setItem(null)}
            onSubmit={edit}
            initialValues={item}
            decorators={[ guessSlag ]}
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
          </ManagmentPopup>
        ) : null
      }
    </div>
  )
}

export default connector(ProductManager);
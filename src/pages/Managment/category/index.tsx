import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, match } from 'react-router-dom';
import { Field } from 'react-final-form';
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'
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
import { getId } from 'lib/id';
import { ManagmentPopup, MItem, Header } from '../components';
import Price from './price'
import Tree from '../components/tree';
import { getMax } from '../helper';
import { EitherEdit } from '../Types';
import styles from './category.module.css';
import createDecorator from "final-form-calculate";
import { translite } from "lib/commonHelpers";
import { Decorator } from 'final-form';

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

function createItem(sortIndex: number = 0, parentId: string = 'root'): CategoryItem {
  return {
    id: getId(10),
    name: '',
    title: '',
    sortIndex,
    parentId,
    count: 0,
  }
}

export function getPrentsList<T extends CategoryItem>(list: ReadonlyArray<T>) {
  const l = list.filter(f => f.count === 0);
  return (current: string) => {
    return [
      { name: 'root', title: '(коневой уровень)'},
      ...l.filter(f => f.id !== current)
        .map(({ id, title }) => ({ name: id, title })),
    ];
  }
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type EitherCategory = EitherEdit<CategoryItem>;

interface Props extends PropsFromRedux {
  match: match<{category?: string}>;
}

const guessSlag = createDecorator({
  field: 'title',
  updates: {
    name: (v: string) => translite(v || ''),
  }
}) as Decorator<CategoryItem>;

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

  const optionList = React.useMemo(() => getPrentsList(categories), [categories]);

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
            getKey={e => e.id}
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
                list={optionList(item.name)}
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
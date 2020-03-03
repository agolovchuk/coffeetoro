import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, match } from 'react-router-dom';
import { Field } from 'react-final-form';
import groupBy from 'lodash/groupBy'
import { categoriesListSelector, CRUD, CategoryItem, getCategoriesAction } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { ManagmentPopup, MItem, Header } from '../components';
import { InputField, SelectField } from 'components/Form/field';
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
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
  getCategories: getCategoriesAction,
}

function createItem(sortIndex: number = 0, parentName: string = ''): CategoryItem {
  return {
    name: '',
    title: '',
    sortIndex,
    parentName,
    count: 0,
  }
}

export function getPrentsList<T extends CategoryItem>(list: ReadonlyArray<T>) {
  const l = list.filter(f => f.count === 0);
  return (current: string) => {
    return [{ name: 'root', title: '(коневой уровень)'}, ...l.filter(f => f.name !== current)];
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

function ProductManager({ categories, getCategories, update, create, ...props }: Props) {
  const { params } = props.match;
  const [item, setItem] = React.useState<EitherCategory | null>(null);

  const edit = React.useCallback(
    ({ isEdit, ...value }: EitherCategory) => {
      if (isEdit) {
        update('categories', value)
      } else {
        create('categories', value);
      }
      setItem(null);
    }, [update, create],
  );

  const createLink = ({ name }: CategoryItem) => ['/manager', 'category', name].join('/');

  const group = groupBy(categories, 'parentName');
  React.useEffect(() => { getCategories('name'); }, [getCategories]);

  const optionList = React.useMemo(() => getPrentsList(categories), [categories]);

  const createCategory = React.useCallback(() => {
    const cat = createItem(getMax(categories) + 1, params.category);
    setItem(cat);
  }, [params, categories]);

  return (
    <div className={styles.container}>
      <section className={styles.column}>
        <div className={styles.view}>
          <Tree
            data={group}
            getName={e => e ? e.name : 'root'}
            getKey={e => e.name}
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
      <Route path="/manager/category/:category" component={Price} />
      {
        item !== null ? (
          <ManagmentPopup
            title="Категория"
            onCancel={() => setItem(null)}
            onSubmit={edit}
            initialValues={item}
            decorators={[ guessSlag ]}
          >
            <Field name="parentName" render={({ input, meta }) => (
              <SelectField
                list={optionList(item.name)}
                id="parentName"
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
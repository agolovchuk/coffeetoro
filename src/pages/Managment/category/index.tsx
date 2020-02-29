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
import { getMax, getLink, getPrentsList } from '../helper';
import { EitherEdit } from '../Types';
import styles from './category.module.css';

const mapState = (state: AppState) => ({
  categories: categoriesListSelector(state),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
  getCategories: getCategoriesAction,
}

function createItem(sortIndex: number = 0): CategoryItem {
  return {
    name: '',
    title: '',
    sortIndex,
    parentName: '',
    count: 0,
  }
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type EitherCategory = EitherEdit<CategoryItem>;

interface Props extends PropsFromRedux {
  match: match;
}

function ProductManager({ categories, getCategories, update, create, ...props }: Props) {

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

  const createLink = ({ name }: { name: string }) => getLink(props.match.url, name);
  const group = groupBy(categories, 'parentName');
  React.useEffect(() => { getCategories('name'); }, [getCategories]);

  return (
    <div className={styles.container}>
      <section className={styles.column}>
        <Tree
          data={group}
          getName={e => e ? e.name : 'root'}
          getKey={e => e.name}
        >
          {
            (data) => data ? (
              <MItem
                data={data}
                getLink={createLink}
                onEdit={(value) => setItem({ ...value, isEdit: true })}
              />
            ) : (
              <Header
                title="Категории"
                onCreate={() => setItem(createItem(getMax(categories) + 1))}
              />
            )
          }
        </Tree>
        <ul className={styles.list}>
          {/* <ItemList list={categories} getKey={c => c.name}>
            {
              (data) => (
                <MItem
                  data={data}
                  getLink={createLink}
                  onEdit={(value) => setItem({ ...value, isEdit: true })}
                />
              )
            }
          </ItemList> */}
        </ul>
      </section>
      <Route path="/manager/category/:category" component={Price} />
      {
        item !== null ? (
          <ManagmentPopup
            title="Категория"
            onCancel={() => setItem(null)}
            onSubmit={edit}
            initialValues={item}
          >
            <Field name="parentName" render={({ input, meta }) => (
              <SelectField
                list={getPrentsList(item.name, categories)}
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
import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route } from 'react-router-dom';
import { Field } from 'react-final-form';
import { getId } from 'lib/id';
import { categoriesListSelector, CRUD, CategoryItem } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { ManagmentPopup, ItemList, MItem, Header } from '../components';
import { InputField } from 'components/Form/field';
import Product from '../product'
import Price from '../price'
import { getMax } from '../helper';
import { EitherEdit } from '../Types';
import styles from './category.module.css';
import '../mgm.css';

const mapState = (state: AppState) => ({
  categories: categoriesListSelector(state),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
}

function createItem(sortIndex: number = 0): CategoryItem {
  return {
    id: getId(10),
    name: '',
    title: '',
    sortIndex,
  }
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type EitherCategory = EitherEdit<CategoryItem>;

interface Props extends PropsFromRedux {}

function ProductManager({ categories, ...props }: Props) {

  const [item, setItem] = React.useState<EitherCategory | null>(null);

  const edit = ({ isEdit, ...value }: EitherCategory) => {
    if (isEdit) {
      props.update('categories', value)
    } else {
      props.create('categories', value);
    }
    setItem(null);
  }

  React.useEffect(() => {
    props.getDictionary('categories');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.container}>
      <section className={styles.column}>
        <Header
          title="Категории"
          onCreate={() => setItem(createItem(getMax(categories) + 1))}
        />
        <ul className={styles.list}>
          <ItemList list={categories} getKey={c => c.name}>
            {
              (data) => (
                <MItem
                  data={data}
                  getLink={`/manager/${data.name}`}
                  onEdit={(value) => setItem({ ...value, isEdit: true })}
                />
              )
            }
          </ItemList>
        </ul>
      </section>
      <Route path="/manager/:category" component={Product} />
      <Route path="/manager/:category/:product" component={Price} />
      {
        item !== null ? (
          <ManagmentPopup
            title="Категория"
            onCancel={() => setItem(null)}
            onSubmit={edit}
            initialValues={item}
          >
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
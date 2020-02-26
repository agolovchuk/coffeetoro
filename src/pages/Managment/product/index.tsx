import * as React from 'react';
import { match } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import { InputField, SelectField } from 'components/Form/field';
import {
  productsListSelector,
  ProductItem,
  categoriesListSelector,
  CRUD,
} from 'domain/dictionary';
import { ManagmentPopup, ItemList, MItem, Header } from '../components';
import { AppState } from 'domain/StoreType';
import { EitherEdit } from '../Types';
import { getMax } from '../helper';
import styles from './product.module.css';

function createProduct(categoryName: string, sortIndex: number = 0): ProductItem {
  return {
    id: getId(12),
    name: '',
    title: '',
    sortIndex,
    categoryName,
  }
}

const mapState = (state: AppState) => ({
  products: productsListSelector(state),
  categories: categoriesListSelector(state),
});

const mapDispatch = {
  update: CRUD.updateItemAction,
  create: CRUD.createItemAction,
  getDictionary: CRUD.getAllAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  match: match<{category: string}>
}

function ProductManager({ products, match, ...props }: Props) {

  const { category } = match.params;

  const [item, setItem] = React.useState<EitherEdit<ProductItem> | null>(null);

  const createItem = () => setItem(createProduct(category, getMax(products) + 1));

  const edit = ({ isEdit, ...value }: EitherEdit<ProductItem>) => {
    if (isEdit) {
      props.update('products', value)
    } else {
      props.create('products', value);
    }
    setItem(null);
  }

  React.useEffect(() => {
    props.getDictionary('products', category, 'categoryName');
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={styles.column}>
      <Header
        title="Продукты"
        onCreate={createItem}
      />
      <ul>
        <ItemList list={products} getKey={c => c.name}>
          {
            (data) => (
              <MItem
                data={data}
                getLink={`/manager/${match.params.category}/${data.name}`}
                onEdit={(d) => setItem({ ...d, isEdit: true })}
              />
            )
          }
        </ItemList>
      </ul>
      {
        item !== null ? (
          <ManagmentPopup
            title="Продук"
            initialValues={item}
            onCancel={() => setItem(null)}
            onSubmit={edit}
          >
            <Field name="categoryName" render={({ input, meta }) => (
              <SelectField
                id="categoryName"
                title="Категория:"
                list={props.categories}
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
    </section>
  )
}



export default connector(ProductManager);
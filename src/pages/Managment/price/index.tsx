import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import get from 'lodash/get';
import { InputField, SelectField, PriceField } from 'components/Form/field';
import { Price } from 'components/Units';
import { AppState } from 'domain/StoreType';
import {
  pricesListSelector,
  unitsListSelector,
  CRUD,
  PriceItem,
  priceByNameSelector,
  unitsByIdSelector,
} from 'domain/dictionary';
import { ManagmentPopup, ItemList, Header } from '../components';

import { getMax } from '../helper';
import { EitherEdit } from '../Types';
import styles from './price.module.css';

function createItem(productName: string, sortIndex: number): PriceItem {
  return {
    id: getId(16),
    productName,
    fromDate: new Date().toISOString(),
    expiryDate: null,
    unitId: '1',
    valuation: 0,
    barcode: '',
    sortIndex,
  }
}

const mapState = (state: AppState) => ({
  prices: pricesListSelector(state),
  products: priceByNameSelector(state),
  units: unitsListSelector(state),
  unitsById: unitsByIdSelector(state),
})

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  match: match<{ category: string, product: string }>
}

function PriceManager({ prices, ...props }: Props) {
  const { product } = props.match.params


  const [item, setItem] = React.useState<EitherEdit<PriceItem> | null>(null);

  const edit = ({ isEdit, valuation, ...value }: EitherEdit<PriceItem>) => {
    if (isEdit) {
      props.update('prices', {...value, valuation: Number(valuation)})
    } else {
      props.create('prices', {...value, valuation: Number(valuation)});
    }
    setItem(null);
  }

  React.useEffect(() => {
    props.getDictionary('prices', product, 'productName');
    props.getDictionary('units');
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={styles.column}>
      <Header
        title="Ценники"
        onCreate={() => setItem(createItem(product, getMax(prices) + 1))}
      />
      <ItemList list={prices} getKey={c => c.id}>
        {
          (data) => (
            <div className={styles.item}>
              <dl className={styles.itemTitle}>
                <dt>{get(props.unitsById, [data.unitId, 'title'], '')}</dt>
                <dd><Price value={data.valuation} sign currencyDisplay="symbol" /></dd>
              </dl>
              <button
                type="button"
                className="button_edit"
                onClick={() => setItem({ ...data, isEdit: true })}
              />
            </div>
          )
        }
      </ItemList>
      {
        item !== null ? (
          <ManagmentPopup
            initialValues={item}
            onCancel={() => setItem(null)}
            title={`Цена на "${props.products[product].title}"`}
            onSubmit={edit}
          >
            <Field name="unitId" render={({ input, meta }) => (
              <SelectField
                list={props.units.map(e => ({ name: e.id, title: e.title }))}
                id="unitId"
                title="Единица измерения:"
                {...input}
              />
            )}/>
            <Field name="barcode" render={({ input, meta }) => (
              <InputField id="barcode" title="Barcode:" {...input} />
            )}/>
            <Field name="valuation" render={({ input, meta }) => (
              <PriceField id="valuation" title="Цена за единицу:" {...input} />
            )}/>
          </ManagmentPopup>
        ) : null
      }
    </section>
  )
}

export default connector(PriceManager);

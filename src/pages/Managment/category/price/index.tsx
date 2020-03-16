import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import get from 'lodash/get';
import { InputField, SelectField, PriceField, ISelectList } from 'components/Form/field';
import { Price } from 'components/Units';
import { AppState } from 'domain/StoreType';
import {
  pricesListSelector,
  unitsListSelector,
  CRUD,
  PriceItem,
  priceByNameSelector,
  unitsByIdSelector,
  currentCategorySelector,
  UnitItem,
  createPriceAction,
  updatePriceAction,
} from 'domain/dictionary';
import { ManagmentPopup, ItemList, Header } from '../../components';
import { getMax } from '../../helper';
import { EitherEdit } from '../../Types';
import styles from './price.module.css';

function createItem(categoryId: string, sortIndex: number): PriceItem {
  return {
    id: getId(16),
    categoryId,
    fromDate: new Date(),
    expiryDate: null,
    unitId: '1',
    valuation: 0,
    barcode: '',
    sortIndex,
  }
}

interface PropsFromRouter {
  match: match<{ categoryId: string }>
}

const mapState = (state: AppState, props: PropsFromRouter) => ({
  category: currentCategorySelector(state, props),
  prices: pricesListSelector(state),
  products: priceByNameSelector(state),
  units: unitsListSelector(state),
  unitsById: unitsByIdSelector(state),
})

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  create: createPriceAction,
  update: updatePriceAction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {}

function getPrentsList(current: PriceItem[], units: UnitItem[]) {
  const c: string[] = current.reduce((a, v) => a.includes(v.unitId) ? a : a.concat(v.unitId), [] as string[]);
  return (item: PriceItem) => {
    const cu = c.filter(f => f !== item.unitId);
    return units.reduce((a, {id, title }) => cu.includes(id) ? a : [...a, { name: id, title }], [] as ISelectList);
  }
}

function PriceManager({ prices, update, units, create, getDictionary, category, ...props }: Props) {

  const [item, setItem] = React.useState<EitherEdit<PriceItem> | null>(null);

  const edit = React.useCallback(
    ({ isEdit, valuation, ...value }: EitherEdit<PriceItem>) => {
      if (isEdit) {
        update({...value, valuation: Number(valuation)})
      } else {
        create({...value, valuation: Number(valuation)});
      }
      setItem(null);
    }, [update, create],
  )

  const memoList = React.useMemo(() => getPrentsList(prices, units), [prices, units]);

  const createPrice = React.useCallback(() => {
    setItem(createItem(category.id, getMax(prices) + 1));
  }, [category, prices]);

  React.useEffect(() => {
    getDictionary('prices', category.id, 'categoryId');
    getDictionary('units');
  }, [category, getDictionary]);

  return (
    <section className={styles.column}>
      <Header
        title={`Ценники на "${category.title}"`}
        onCreate={createPrice}
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
            title={`Цена на "${category.title}"`}
            onSubmit={edit}
          >
            <Field name="unitId" render={({ input, meta }) => (
              <SelectField
                list={memoList(item)}
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

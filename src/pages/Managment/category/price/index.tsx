import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import {
  SelectField,
  PriceField,
  Condition,
} from 'components/Form/field';
import { Price } from 'components/Units';
import { AppState } from 'domain/StoreType';
import {
  extendetPricesSelector,
  PriceBase,
  PriceTMC,
  priceByNameSelector,
  currentCategorySelector,
  createPriceAction,
  updatePriceAction,
  getPricesByCategoryAction,
} from 'domain/dictionary';
import { ManagmentPopup, ItemList, Header } from '../../components';
import { getMax } from '../../helper';
import ArticleSelector from './articles';
import ProccessCardSelector from './process';
import { EitherEdit } from '../../Types';
import { getTitle } from '../../helper';
import styles from './price.module.css';

const TYPE = [
  { name: 'tmc', title: 'TMC' },
  { name: 'pc', title: 'Process Card' },
]

function createItem(parentId: string, sortIndex: number): PriceTMC {
  return {
    id: getId(16),
    parentId,
    add: new Date(),
    expiry: null,
    valuation: 0,
    sortIndex,
    type: 'tmc',
    barcode: '',
  }
}

interface PropsFromRouter {
  match: match<{ categoryId: string }>
}

const mapState = (state: AppState, props: PropsFromRouter) => ({
  category: currentCategorySelector(state, props),
  prices: extendetPricesSelector(state, props),
  products: priceByNameSelector(state),
})

const mapDispatch = {
  getPrices: getPricesByCategoryAction,
  create: createPriceAction,
  update: updatePriceAction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {}

function PriceManager({ prices, update, create, category, getPrices }: Props) {

  const [item, setItem] = React.useState<EitherEdit<PriceBase> | null>(null);

  const edit = React.useCallback(
    ({ isEdit, valuation, ...value }) => {
      if (isEdit) {
        update({...value, valuation: Number(valuation)})
      } else {
        create({...value, valuation: Number(valuation)});
      }
      setItem(null);
    }, [update, create],
  )

  const createPrice = React.useCallback(() => {
    setItem(createItem(category.id, getMax(prices) + 1));
  }, [category, prices]);

  React.useEffect(() => {
    getPrices(category.id);
  }, [category, getPrices]);

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
                <dt>{getTitle(data)}</dt>
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
            <Field name="type" render={({ input, meta }) => (
              <SelectField
                list={TYPE}
                id="type"
                title="Source:"
                {...input}
              />
            )}/>
            <Condition when="type" is="tmc" >
              <ArticleSelector />
            </Condition>
            <Condition when="type" is="pc" >
              <ProccessCardSelector />
            </Condition>
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

import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import cx from 'classnames';
import {
  SelectField,
  PriceField,
  Condition,
  CheckBoxField
} from 'components/Form/field';
import { Price } from 'components/Units';
import { AppState } from 'domain/StoreType';
import {
  extendedPricesSelector,
  PriceBase,
  PriceTMC,
  priceByNameSelector,
  currentCategorySelector,
  createPriceAction,
  updatePriceAction,
  getPricesByCategoryAction, categoriesListSelector,
} from 'domain/dictionary';
import { ManagementPopup, ItemList, Header } from '../../components';
import { getMax } from '../../helper';
import { ArticleSelector, ProcessCardSelector } from '../../components/selectors';
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

function priceUpdateAdapter({ type, refId, ...rest }: any, { barcode }: any): any {
  return { ...rest, type: 'tmc', barcode: barcode || '' }
}

interface PropsFromRouter {
  match: match<{ categoryId: string }>
}

const mapState = (state: AppState, props: PropsFromRouter) => ({
  categories: categoriesListSelector(state),
  category: currentCategorySelector(state, props),
  prices: extendedPricesSelector(state, props),
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

function PriceManager({ prices, update, create, category, getPrices, categories }: Props) {

  const [item, setItem] = React.useState<EitherEdit<PriceBase> | null>(null);

  const edit = React.useCallback(
    ({ isEdit, expiry, valuation, ...value }) => {
      if (isEdit) {
        update({
          ...value,
          expiry: expiry ? new Date() : null,
          valuation: Number(valuation)
        });
      } else {
        create({...value, valuation: Number(valuation)});
      }
      setItem(null);
    }, [update, create],
  )

  const createPrice = React.useCallback(() => {
    setItem(createItem(category.id, getMax(prices) + 1));
  }, [category, prices]);

  const optionList = React.useMemo(() => categories.map(({ id, title }) => ({ name: id, title })), [categories]);

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
            <div className={cx(styles.item, {[styles.disabled]: data.expiry })}>
              <dl className={styles.itemTitle}>
                <dt>{getTitle(data)}</dt>
                <dd><Price value={data.valuation} sign currencyDisplay="symbol" /></dd>
              </dl>
              {
                data.expiry ? null : (
                  <button
                    type="button"
                    className="btn__edit"
                    onClick={() => setItem({ ...data, isEdit: true })}
                  />
                )
              }
            </div>
          )
        }
      </ItemList>
      {
        item !== null ? (
          <ManagementPopup
            initialValues={item}
            onCancel={() => setItem(null)}
            title={`Цена на "${category.title}"`}
            onSubmit={edit}
          >
            {
              item.isEdit ? (
                <Field name="expiry" render={({ input }) => (
                  <CheckBoxField id="expiry" title="Mark as deleted" {...input} />
                )}/>
              ) : null
            }
            <Field name="parentId" render={({ input }) => (
              <SelectField
                list={optionList}
                id="parentId"
                title="Category"
                {...input}
              />
            )}/>

            <Field name="type" render={({ input}) => (
              <SelectField
                list={TYPE}
                id="type"
                title="Source:"
                {...input}
              />
            )}/>
            <Condition when="type" is="tmc" >
              <ArticleSelector updateAdapter={priceUpdateAdapter} />
            </Condition>
            <Condition when="type" is="pc" >
              <ProcessCardSelector />
            </Condition>
            <Field name="valuation" render={({ input, meta }) => (
              <PriceField id="valuation" title="Цена за единицу:" {...input} />
            )}/>
          </ManagementPopup>
        ) : null
      }
    </section>
  )
}

export default connector(PriceManager);

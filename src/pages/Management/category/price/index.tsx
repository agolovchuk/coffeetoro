import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import pick from "lodash/pick";
import cx from 'classnames';
import { CheckBoxField, Condition, SelectField } from 'components/Form/field';
import { Price } from 'components/Units';
import { AppState } from 'domain/StoreType';
import {
  categoryGroupListSelector,
  createPriceAction,
  currentCategorySelector,
  EGroupName,
  extendedPricesSelector,
  getPricesByCategoryAction,
  PriceBase,
  priceByNameSelector,
  PricePC,
  PriceTMC,
  putArticlesAction,
  TMCItem,
  updatePriceAction,
  EArticlesType,
} from 'domain/dictionary';
import {Header, ItemList, ManagementPopup} from 'modules/manage';
import {getMax, getTitle} from '../../helper';
import {ArticleSelector, ProcessCardSelector} from 'modules/manage/selectors';
import {EitherEdit} from '../../Types';
import {cleanPrice, priceFormAdapter, priceSubmitAdapter} from '../helpers';
import PricingGroup, {PricingField} from "components/Form/Pricing";
import styles from './price.module.css';

const TYPE = [
  { name: EArticlesType.ARTICLES, title: 'TMC' },
  { name: EArticlesType.PC, title: 'Process Card' },
]

function createItem(parentId: string, sortIndex: number): PriceTMC {
  return {
    id: getId(16),
    parentId,
    add: new Date(),
    expiry: null,
    valuation: 0,
    sortIndex,
    type: EArticlesType.ARTICLES,
    barcode: '',
    step: 1,
    quantity: 1,
  }
}

function priceUpdateAdapter({ type, refId, ...rest }: any, { barcode }: any): any {
  return { ...rest, type: EArticlesType.ARTICLES, barcode: barcode || '' }
}

interface PropsFromRouter {
  match: match<{ categoryId: string }>
}

const mapState = (state: AppState, props: PropsFromRouter) => ({
  categories: categoryGroupListSelector(state, EGroupName.PRICES),
  category: currentCategorySelector(state, props),
  prices: extendedPricesSelector(state, props),
  products: priceByNameSelector(state),
});

const mapDispatch = {
  getPrices: getPricesByCategoryAction,
  create: createPriceAction,
  update: updatePriceAction,
  putArticles: putArticlesAction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {}

function PriceManager({ prices, update, create, category, getPrices, categories, putArticles }: Props) {

  const [item, setItem] = React.useState<EitherEdit<PriceBase> | null>(null);

  const edit = React.useCallback(
    ({ isEdit, expiry, ...value }) => {
      const v: PriceTMC | PricePC = cleanPrice(value);
      if (isEdit) {
        update({
          ...priceSubmitAdapter(v),
          expiry: expiry ? new Date() : null,
        });
      } else {
        create(priceSubmitAdapter(value));
      }
      setItem(null);
    }, [update, create],
  )

  const putArticle = React.useCallback((item: TMCItem) => {
    putArticles([pick(item, ['id', 'parentId', 'title', 'description', 'barcode', 'unitId', 'add', 'update', 'boxing'])]);
  }, [putArticles]);

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
                // data.expiry ? null :
                (
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
            initialValues={priceFormAdapter(item)}
            onCancel={() => setItem(null)}
            title={`Цена на "${category.title}"`}
            onSubmit={edit}
          >
            {
              item.isEdit ? (
                <Field name="expiry" type="checkbox" render={({ input }) => (
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
            <Condition when="type" is={EArticlesType.ARTICLES} >
              <ArticleSelector updateAdapter={priceUpdateAdapter} onPicItem={putArticle} />
              <PricingGroup unit="g" />
            </Condition>
            <Condition when="type" is={EArticlesType.PC} >
              <ProcessCardSelector />
              <PricingField />
            </Condition>
          </ManagementPopup>
        ) : null
      }
    </section>
  )
}

export default connector(PriceManager);

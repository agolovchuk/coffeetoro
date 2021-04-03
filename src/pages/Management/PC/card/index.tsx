import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays';
import cx from 'classnames'
import get from 'lodash/get';
import { InputField, TextAreaField, PriceField } from 'components/Form/field';
import Quantity from 'components/Form/Decimal';
import Price from "components/Units/price";
import {
  processCardSelector,
  getProcessCardAction,
  unitsByIdSelector,
  CRUD,
  ProcessCardItem,
  TMCItem,
  putArticlesAction,
} from 'domain/dictionary';
import { getEntryPriceAction, entryPriceSelector } from 'domain/reports';
import { AppState } from 'domain/StoreType';
import Header from '../../../../modules/manage/header';
import { getTitle, getUnitsTitle } from '../../helper';
import Add from '../../../../modules/manage/selectors/add';
import styles from './card.module.css';

interface SubmitValue extends Omit<ProcessCardItem, 'articles'> {
  articles: ReadonlyArray<{
    item: TMCItem,
    quantity: number,
  }>
}

type RouterProps = {
  match: match<{ pcId: string }>
}

const mapStateToProps = (state: AppState, props: RouterProps) => ({
  card: processCardSelector(state, props),
  units: unitsByIdSelector(state),
  entryPrice: entryPriceSelector(state),
});

const mapDispatch = {
  getPC: getProcessCardAction,
  getAll: CRUD.getAllAction,
  update: CRUD.updateItemAction,
  putArticles: putArticlesAction,
  getEntryPrice: getEntryPriceAction,
}

const connector = connect(mapStateToProps, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouterProps {}

function Item({ card, getPC, match, getAll, units, update, putArticles, getEntryPrice, entryPrice }: Props) {
  const { params: { pcId } } = match;

  const onSubmit = React.useCallback(({ articles, ...value }: SubmitValue) => {
    const a = articles.map(({ item, quantity }) => ({ id: item.id, quantity: Number(quantity) }));
    putArticles(articles.map(e => e.item));
    update('processCards', { ...value, articles: a });
  }, [update, putArticles]);

  React.useEffect(() => {
    getPC(pcId);
    getAll('units')
  }, [pcId, getPC, getAll]);

  React.useEffect(() => { getEntryPrice(); }, [getEntryPrice]);

  const initialValues = React.useMemo(() => card, [card]);

  const estimate = React.useMemo(() => {
    if (typeof card === 'undefined') return 0;
    return card.articles.reduce((a, v) => {
      const p = get(entryPrice, [get(v, ['item', 'barcode'], '')]);
      if (typeof p === 'undefined') return a;
      return a + ((p.s / p.q) * v.quantity);
    }, 0);
  }, [card, entryPrice]);

  return card ? (
    <section className={cx('scroll-section', styles.container)}>
      <Header title={card.title} />
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <Field name="description" render={({ input }) => (
              <InputField id="description" title="Description:" {...input} />
            )}/>
            <div className={styles.group}>
              <Field name="primeCost" render={({ input }) => (
                <PriceField id="primeCost" title="Себестоимость:" {...input} />
              )}/>
              <dl className={styles.estimated}>
                <dt>Расчетная стоимость:</dt>
                <dd><Price value={estimate} sign /></dd>
              </dl>
            </div>
            <Field name="prescription" render={({ input }) => (
              <TextAreaField id="prescription" title="Рекомендация:" {...input} />
            )}/>
            <FieldArray name="articles" >
              {
                ({ fields }) => (
                  <ul className={styles.list}>
                    {
                      fields.map((name, index) => (
                        <li key={name} className={styles.item}>
                          <Field name={`${name}.item`} render={({ input }) => (
                            <div className={styles.article}>{getTitle(input.value)}</div>
                          )}/>
                          <Field name={`${name}.quantity`} render={({ input}) => (
                            <Quantity
                              {...input}
                              id={`${name}.quantity`}
                              multiplier={1}
                              className={styles.quantity}
                            />
                          )}/>
                          <Field name={`${name}.item`} render={({ input }) => (
                            <div className={styles.unit}>{getUnitsTitle(units, input.value)}</div>
                          )}/>
                          <button
                            className={cx("btn__remove", styles.remove)}
                            onClick={() => fields.remove(index)}
                          />
                        </li>
                      ))
                    }
                    <Add onAdd={(data) => fields.push({ item: data, quantity: 0 })} />
                  </ul>
                )
              }
            </FieldArray>
            <div className={styles.btnGroup}>
              <button
                type="submit"
                className={cx("btn__positive", styles.submit)}
              >Save</button>
            </div>
          </form>
        )}
      />
    </section>
  ) : null;
}

export default connector(Item);

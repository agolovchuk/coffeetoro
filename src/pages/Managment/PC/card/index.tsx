import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays';
import cx from 'classnames'
import { InputField } from 'components/Form/field';
import Quantity from 'components/Form/Quantity';
import {
  processCardSelector,
  getProcessCardAction,
  unitsByIdSelector,
  CRUD,
  ProcessCardItem,
  TMCItem,
  putArticlesAction,
} from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import Header from '../../components/header';
import { getTitle, getUnitsTitle } from '../../helper';
import Add from './add';
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
});

const mapDispatch = {
  getPC: getProcessCardAction,
  getAll: CRUD.getAllAction,
  update: CRUD.updateItemAction,
  putArticles: putArticlesAction
}

const connector = connect(mapStateToProps, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouterProps {}

function Item({ card, getPC, match, getAll, units, update, putArticles }: Props) {
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

  const initialValues = React.useMemo(() => card, [card]);

  return card ? (
    <section className={cx('scroll-section', styles.container)}>
      <Header title={card.title} />
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="description" render={({ input }) => (
              <InputField id="description" title="Description:" {...input} />
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

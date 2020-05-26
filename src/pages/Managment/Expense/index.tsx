import * as React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { Field } from "react-final-form";
import { CRUD, getExpenseAction, extendedExpanseSelector, ExpenseExtended } from "domain/dictionary";
import { AppState } from 'domain/StoreType';
import {Condition, InputField, PriceField, SelectField } from "components/Form/field";
import { Main } from "../components";
import { ArticleSelector, ServiceSelector } from "../components/selectors";
import { EitherEdit } from "../Types";
import Item from './item';
import {
  articleUpdateAdapter,
  serviceUpdateAdapter,
  createItem,
  editAdapter,
} from './helpers';

const TYPE = [
  { name: 'product', title: 'Товары' },
  { name: 'service', title: 'Услуги' },
]

const SOURCE = [
  { name: 'cash', title: 'Касса' },
  { name: 'bank', title: 'Банк' },
  { name: 'income', title: 'Сторонние' },
]

const mapState = (state: AppState) => ({
  list: extendedExpanseSelector(state),
});

const mapDispatch = {
  update: CRUD.updateItemAction,
  create: CRUD.createItemAction,
  getAll: getExpenseAction,
}
const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector> { }

function Expense({ list, update, create, getAll }: Props) {

  const handleSubmit = React.useCallback(
    ({ isEdit, title, description, date, ...value }: EitherEdit<ExpenseExtended>, cb: () => void) => {
      if (isEdit) {
        update('expenses', { ...value, date: new Date(date) });
      } else {
        create('expenses', { ...value, date: new Date(date) });
      }
      cb();
    }, [create, update],
  );

  React.useEffect(() => { getAll(); }, [getAll]);

  return (
    <Main
      list={list}
      title="Expense"
      createItem={createItem}
      editAdapter={editAdapter}
      handleSubmit={handleSubmit}
      popupTitle="Add Expense order"
      createLink={() => '/'}
      createTitle={(d :ExpenseExtended) => (<Item {...d} />)}
    >
      <Field name="type" render={({ input}) => (
        <SelectField
          list={TYPE}
          id="type"
          title="Тип:"
          {...input}
        />
      )}/>
      <Field name="date" render={({ input}) => (
        <InputField id="date" title="Дата:" type='date' {...input} />
      )}/>
      <Field name="foreignId" render={({ input}) => (
        <InputField id="foreignId" title="Номер накладной:" {...input} />
      )}/>
      <Condition when="type" is="product" >
        <ArticleSelector updateAdapter={articleUpdateAdapter} />
      </Condition>
      <Condition when="type" is="service" >
        <ServiceSelector updateAdapter={serviceUpdateAdapter} />
      </Condition>
      <Field name="source" render={({ input}) => (
        <SelectField
          list={SOURCE}
          id="source"
          title="Источник денег:"
          {...input}
        />
      )}/>
      <Field name="quantity" render={({ input}) => (
        <InputField id="quantity" title="Количество:" {...input} />
      )}/>
      <Field name="valuation" render={({ input}) => (
        <PriceField id="valuation" title="Цена за единицу:" {...input} />
      )}/>
    </Main>
  )
}

export default connector(Expense);

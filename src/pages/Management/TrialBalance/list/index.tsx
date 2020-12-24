import * as React from "react";
import { Field } from "react-final-form";
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";

import filter from 'lodash/fp/filter';
import compose from 'lodash/fp/compose';
import { userSelector } from 'domain/env';
import {
  CRUD,
  getExpenseAction,
  balanceListSelector,
  putArticlesAction,
  DocumentItem,
  Summa,
} from "domain/dictionary";
import { AppState } from 'domain/StoreType';
import { Price } from "components/Units";
import {InputField, SelectField} from "components/Form/field";
import { Main, Period, Filter } from "../../components";
import { EitherEdit } from "../../Types";
import {
  cleanExp,
  TYPE,
} from '../../Expense/helpers';

import { createDocumentGroup, editAdapter, ACCOUNT, SHEET_TYPE } from './helpers';

import Line from '../item';
import styles from './balance.module.css';

const mapState = (state: AppState) => ({
  list: balanceListSelector(state),
  user: userSelector(state),
});

const mapDispatch = {
  update: CRUD.updateItemAction,
  create: CRUD.createItemAction,
  // getAll: getExpenseAction,
  putArticles: putArticlesAction,
}
const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps { }

function orderUsers<T extends { date: Date }>(a: T, b: T): number {
  return a.date.getTime() - b.date.getTime();
}

type FilterState = undefined | 'bank' | 'cash';

function DocumentsList({ list, update, create, putArticles, user, ...rest }: Props) {

  console.log(rest, '##');

  const [filterParams, setFilter] = React.useState<FilterState>();

  const handleSubmit = React.useCallback(
    ({ isEdit, date, ...value }: EitherEdit<DocumentItem>, cb: () => void) => {
      if (isEdit) {
        update('documents', {
          ...cleanExp(value),
          date: new Date(date)
        });
      } else {
        create('documents', {
          ...value,
          date: new Date(date),
          createBy: user && user.id,
        });
        rest.history.push(`${rest.location.pathname}/${value.id}`)
      }
      cb();
    }, [create, update, user],
  );

  // const expanseList = React.useMemo(() => {
  //   return compose(
  //     filter((f: DocumentGroup & Summa ) => filterParams ? f.source === filterParams : true),
  //   )(list)
  // }, [list, filterParams]);

  // React.useEffect(() => {
  //   getAll();
  // }, [getAll]);

  const handleSetPeriod = React.useCallback(({ from, to }) => {
  //   getAll(from, to);
  }, []);

  return (
    <Main
      list={[]}
      title="Balance"
      createItem={createDocumentGroup}
      editAdapter={editAdapter}
      handleSubmit={handleSubmit}
      popupTitle="Ордер"
      createLink={({ id }) => `/manager/trial-balance/${id}`}
      createTitle={(d) => (<Line {...d} />)}
      // orderBy={orderUsers}
      header={(
        <React.Fragment>
          <Period onSubmit={handleSetPeriod} />
          <Filter onChange={setFilter} value={filterParams} />
          <div className={styles.sum}>
            <Price value={0} sign currencyDisplay="narrowSymbol" />
          </div>
        </React.Fragment>
      )}
    >
      <Field name="id" render={({ input }) => (
        <input type="hidden" value={input.value} />
      )}/>
      <Field name="date" render={({ input}) => (
        <InputField id="date" title="Дата:" type='date' {...input} />
      )}/>
      <Field name="type" render={({ input}) => (
        <SelectField
          list={SHEET_TYPE}
          id="type"
          title="Тип:"
          {...input}
        />
      )}/>
      <Field name="account" render={({ input}) => (
        <SelectField
          list={ACCOUNT}
          id="account"
          title="Счет:"
          {...input}
        />
      )}/>
      <Field name="about" render={({ input}) => (
        <InputField id="about" title="Описание:" {...input} />
      )}/>
    </Main>
  )
}

export default connector(DocumentsList);

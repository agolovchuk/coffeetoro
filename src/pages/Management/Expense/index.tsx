import * as React from "react";
import { connect, ConnectedProps } from 'react-redux';
import pick from "lodash/pick";
import filter from 'lodash/fp/filter';
import compose from 'lodash/fp/compose';
import { summa } from 'lib/decimal';
import { userSelector } from 'domain/env';
import {
  CRUD,
  getExpenseAction,
  extendedExpanseByUserSelector,
  ExpenseExtended,
  putArticlesAction, TMCItem,
} from "domain/dictionary";
import { AppState } from 'domain/StoreType';
import { Price } from "components/Units";
import { Main, Period, Filter } from "../components";
import { ManagerForm, UserForm } from './forms';
import { EitherEdit } from "../Types";
import Item from './item';
import {
  createItem,
  editAdapter,
  cleanExp,
} from './helpers';
import styles from './exp.module.css';

const mapState = (state: AppState) => ({
  list: extendedExpanseByUserSelector(state),
  user: userSelector(state),
});

const mapDispatch = {
  update: CRUD.updateItemAction,
  create: CRUD.createItemAction,
  getAll: getExpenseAction,
  putArticles: putArticlesAction,
}
const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector> { }

function orderUsers(a: ExpenseExtended, b: ExpenseExtended): number {
  return a.date.getTime() - b.date.getTime();
}

type FilterState = undefined | 'bank' | 'cash';

function Expense({ list, update, create, getAll, putArticles, user }: Props) {

  const [filterParams, setFilter] = React.useState<FilterState>();

  const handleSubmit = React.useCallback(
    ({ isEdit, date, ...value }: EitherEdit<ExpenseExtended>, cb: () => void) => {
      if (isEdit) {
        update('expenses', {
          ...cleanExp(value),
          date: new Date(date)
        });
      } else {
        create('expenses', {
          ...value,
          date: new Date(date),
          createBy: user && user.id,
        });
      }
      cb();
    }, [create, update, user],
  );

  const expanseList = React.useMemo(() => {
    return compose(
      filter((f: ExpenseExtended) => filterParams ? f.source === filterParams : true),
    )(list)
  }, [list, filterParams]);

  const sum = React.useMemo(() => summa(expanseList), [expanseList]);

  const putArticle = React.useCallback((item: TMCItem) => {
    putArticles([pick(item, ['id', 'parentId', 'title', 'description', 'barcode', 'unitId', 'add', 'update'])]);
  }, [putArticles]);

  React.useEffect(() => { getAll(); }, [getAll]);

  const handleSetPeriod = React.useCallback(({ from, to }) => {
    getAll(from, to);
  }, [getAll]);

  return (
    <Main
      list={expanseList}
      title="Expense"
      createItem={createItem}
      editAdapter={editAdapter}
      handleSubmit={handleSubmit}
      popupTitle="Расходный ордер"
      createLink={() => '/'}
      createTitle={(d :ExpenseExtended) => (<Item {...d} />)}
      orderBy={orderUsers}
      header={user?.role === 'manager' ? (
        <React.Fragment>
          <Period onSubmit={handleSetPeriod} />
          <Filter onChange={setFilter} value={filterParams} />
          <div className={styles.sum}>
            <Price value={sum} sign currencyDisplay="narrowSymbol" />
          </div>
        </React.Fragment>
      ) : null}
    >
      {
        (user && user.role === 'manager') ? (
          <ManagerForm putArticle={putArticle} />
        ) : (
          <UserForm putArticle={putArticle} />
        )
      }
    </Main>
  )
}

export default connector(Expense);

import * as React from "react";
import { connect, ConnectedProps } from 'react-redux';
import pick from "lodash/pick";
import { userSelector } from 'domain/env';
import {
  CRUD,
  getExpenseAction,
  extendedExpanseByUserSelector,
  ExpenseExtended,
  putArticlesAction, TMCItem,
} from "domain/dictionary";
import { AppState } from 'domain/StoreType';
import { Main } from "../components";
import { ManagerForm, UserForm } from './forms';
import { EitherEdit } from "../Types";
import Item from './item';
import {
  createItem,
  editAdapter,
} from './helpers';

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

function Expense({ list, update, create, getAll, putArticles, user }: Props) {

  const handleSubmit = React.useCallback(
    ({ isEdit, title, description, quantity, date, ...value }: EitherEdit<ExpenseExtended>, cb: () => void) => {
      if (isEdit) {
        update('expenses', {
          ...value,
          quantity: Number(quantity),
          date: new Date(date)
        });
      } else {
        create('expenses', {
          ...value,
          quantity: Number(quantity),
          date: new Date(date),
          createBy: user && user.id,
        });
      }
      cb();
    }, [create, update, user],
  );

  const putArticle = React.useCallback((item: TMCItem) => {
    putArticles([pick(item, ['id', 'parentId', 'title', 'description', 'barcode', 'unitId', 'add', 'update'])]);
  }, [putArticles]);

  React.useEffect(() => { getAll(); }, [getAll]);

  return (
    <Main
      list={list}
      title="Expense"
      createItem={createItem}
      editAdapter={editAdapter}
      handleSubmit={handleSubmit}
      popupTitle="Расходный ордер"
      createLink={() => '/'}
      createTitle={(d :ExpenseExtended) => (<Item {...d} />)}
      orderBy={orderUsers}
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

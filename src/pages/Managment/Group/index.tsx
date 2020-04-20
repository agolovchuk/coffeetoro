import * as React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { Field } from "react-final-form";
import {GroupArticles, CRUD, groupArticlesSelector } from 'domain/dictionary';
import { InputField } from "components/Form/field";
import { getId } from 'lib/id'
import { AppState } from "domain/StoreType";
import { Main } from "../components";
import { EitherEdit } from "../Types";
import { getTitle } from "../helper";

function createItem(): GroupArticles {
  return {
    id: getId(6),
    title: '',
    description: '',
    group: [],
  };
}

const mapState = (state: AppState) => ({
  list: groupArticlesSelector(state),
});

const mapDispatch = {
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
  getAll: CRUD.getAllAction,
};

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector> {}

function Group({ list, update, create, getAll }: Props) {

  const submit = React.useCallback(
    async ({ isEdit, ...value }: EitherEdit<GroupArticles>, cb: () => void) => {
      if (isEdit) {
        await update('groupArticles', value);
      } else {
        await create('groupArticles', value);
      }
      cb();
    }, [create, update],
  );

  const createLink = React.useMemo(() => {
    return (data: GroupArticles) => ['/manager', 'group', data.id].join('/');
  }, []);

  const editAdapter = React.useCallback((data) => ({ ...data, isEdit: true }), []);

  React.useEffect(() => { getAll('groupArticles'); }, [getAll]);

  return (
    <Main
      list={list}
      title="Group Articles"
      createItem={createItem}
      editAdapter={editAdapter}
      handleSubmit={submit}
      popupTitle="Create Group"
      createLink={createLink}
      createTitle={getTitle}
    >
      <Field name="title" render={({ input }) => (
        <InputField id="title" title="Title:" {...input} />
      )}/>
      <Field name="description" render={({ input }) => (
        <InputField id="description" title="Description:" {...input} />
      )}/>
    </Main>
  );
}

export default connector(Group);

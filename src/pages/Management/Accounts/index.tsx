import { useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useRecords } from 'modules/records';
import { Main } from 'modules/manage';
import { accountFactory, CRUD, accountListSelector, IAccountItem } from 'domain/dictionary';
import * as React from "react";
import { AppState } from "domain/StoreType";
import Row from "modules/manage/row";
import {CheckBoxField, InputField} from "components/Form/field";
import { isRequired } from "components/Form/validate";
import {Field} from "react-final-form";

const ACCOUNT = 'account'

const mapState = (state: AppState) => ({
  list: accountListSelector(state),
});

const mapDispatch = {
  getAll: CRUD.getAllAction,
};
const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

function Account({ getAll, list }: Props) {

  const { manage, editAdapter } = useRecords<IAccountItem>({ name: ACCOUNT });

  const rowItem = useCallback((d) => <Row {...d} prefix={['/manager', 'accounts']} />, []);

  React.useEffect(() => { getAll(ACCOUNT); }, [getAll]);

  const validate = useCallback((r) => {
    if (list.filter(f => f.name === r.name && r.id !== f.id).length > 0) return {
      name: 'Already hes',
    }
    return {};
  }, [list]);

  return (
    <Main
      title="Accounts"
      list={list}
      createItem={accountFactory}
      handleSubmit={manage}
      editAdapter={editAdapter}
      popupTitle="Create Account"
      createLink={rowItem}
      validate={validate}
    >
      <Field name="name" validate={isRequired} render={({input, meta}) => (
        <InputField id="name" title="Имя:" {...input} meta={meta} />
      )}/>
      <Field name="cashLess" type="checkbox" render={({ input}) => (
        <CheckBoxField id="cashLess" title="Безналичный:" {...input} />
      )} />
      <Field name="payInOrder" type="checkbox" render={({ input}) => (
        <CheckBoxField id="payInOrder" title="Для оплаты:" {...input} />
      )} />
      <Field name="description" render={({input, meta}) => (
        <InputField id="description" title="Описание:" {...input} meta={meta} />
      )}/>
    </Main>
  )
}

export default connector(Account);

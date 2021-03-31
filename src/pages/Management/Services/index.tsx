import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import {
  InputField,
} from 'components/Form/field';
import { ServiceItem, CRUD, servicesListSelector } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { Main } from '../components';
import Row from './row';
import { EitherEdit } from '../Types';

function createItem(): ServiceItem {
  return {
    id: getId(8),
    title: '',
    description: '',
    parentId: '',
  }
}

const mapState = (state: AppState) => ({
  list: servicesListSelector(state),
});

const mapDispatch = {
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
  getAll: CRUD.getAllAction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

function TMCManager({ create, update, getAll, ...props }: Props) {

  const handleSubmit = React.useCallback(
    async ({ isEdit, ...value }: EitherEdit<ServiceItem>, cb: () => void) => {
      if (isEdit) {
        await update('services', value);
      } else {
        await create('services', value);
      }
      cb();
    }, [create, update],
  );

  const editAdapter = React.useCallback((value: ServiceItem) => ({
    ...value,
    isEdit: true,
  }), []);

  React.useEffect(() => { getAll('services'); }, [getAll]);

  const rowItem = React.useCallback((d) => <Row {...d} />, [])

  return (
    <Main
      list={props.list}
      title="Services"
      createItem={createItem}
      editAdapter={editAdapter}
      handleSubmit={handleSubmit}
      popupTitle="Add services"
      createLink={rowItem}
    >
      <Field name="title" render={({ input}) => (
        <InputField id="title" title="Title:" {...input} />
      )}/>
      <Field name="description" render={({ input}) => (
        <InputField id="description" title="Description:" {...input} />
      )}/>
    </Main>
  )
}

export default connector(TMCManager);

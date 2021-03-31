import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field } from 'react-final-form';
import { getId } from 'lib/id';
import { InputField } from 'components/Form/field';
import {ProcessCardItem, CRUD, processCardsListSelector} from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { Main } from '../../components';
import { EitherEdit } from '../../Types';
import Row from "../row";

function createItem(): ProcessCardItem {
  return {
    id: getId(12),
    primeCost: 0,
    prescription: '',
    title: '',
    description: '',
    parentId: '',
    add: new Date().toISOString(),
    update: null,
    articles: [],
  }
}

const mapState = (state: AppState) => ({
  pc: processCardsListSelector(state),
});

const mapDispatch = {
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
  getAll: CRUD.getAllAction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

function ProcessCardList ({ create, update, getAll,  ...props }: Props) {

  const handleSubmit = React.useCallback(
    ({ isEdit, ...value }: EitherEdit<ProcessCardItem>, cb: () => void) => {
      if (isEdit) {
        update('processCards', value);
      } else {
        create('processCards', value);
      }
      cb();
    }, [create, update],
  );

  const editAdapter = React.useCallback((value: ProcessCardItem) => ({
    ...value,
    articles: value.articles || [],
    isEdit: true,
    update: new Date().toISOString(),
  }), []);

  React.useEffect(() => {
    getAll('units');
    getAll('processCards');
  }, [getAll]);

  const rowItem = React.useCallback((d) => <Row {...d} />, []);

  return (
    <Main
      list={props.pc}
      title="Process Card"
      createItem={createItem}
      editAdapter={editAdapter}
      handleSubmit={handleSubmit}
      popupTitle="Add Process Card"
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

export default connector(ProcessCardList);

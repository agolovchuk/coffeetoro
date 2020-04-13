import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getId } from 'lib/id';
import { Field } from 'react-final-form';
import {
  InputField,
  SelectField,
  BarcodeField
} from 'components/Form/field';
import { TMCItem, CRUD, tmcListSelector, unitsSelectSelector } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { ManagmentPopup, ItemList, Header, MItem } from '../components';
import { getTitle } from '../helper';
import { EitherEdit } from '../Types';
// import styles from './tmc.module.css';

function createItem(): TMCItem {
  return {
    id: getId(24),
    title: '',
    description: '',
    parentId: '',
    unitId: '1',
    add: new Date().toISOString(),
    update: null,
    barcode: '',
  }
}

const mapState = (state: AppState) => ({
  tmc: tmcListSelector(state),
  units: unitsSelectSelector(state),
});

const mapDispatch = {
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
  getAll: CRUD.getAllAction, 
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {};

function TMCManager({ create, update, units, getAll, ...props }: Props) {

  const [item, setItem] = React.useState<EitherEdit<TMCItem> | null>(null);

  const handleSubmit = React.useCallback(
    ({ isEdit, ...value }: EitherEdit<TMCItem>) => {
      if (isEdit) {
        update('tmc', value);
      } else {
        create('tmc', value);
      }
      setItem(null);
    }, [create, update],
  );

  const handlCreat = () => setItem(createItem());
  const handlEdit = (value: TMCItem) => setItem({ ...value, isEdit: true, update: new Date().toISOString() });

  React.useEffect(() => {
    getAll('units');
    getAll('tmc');
  }, [getAll]);

  return (
    <section>
      <Header title="TMC" onCreate={handlCreat} />
      <ItemList list={props.tmc} getKey={e => e.id}>
        {
          (data) => (
            <MItem
              data={data}
              title={getTitle(data)}
              getLink={() => ''}
              onEdit={handlEdit}
            />
          )
        }
      </ItemList>
      {
        item && (
          <ManagmentPopup
            title="Add TMC"
            onCancel={() => setItem(null)}
            initialValues={item}
            onSubmit={handleSubmit}
          >
            <Field name="title" render={({ input, meta }) => (
              <InputField id="title" title="Title:" {...input} />
            )}/>
            <Field name="description" render={({ input, meta }) => (
              <InputField id="description" title="Description:" {...input} />
            )}/>
            <Field name="unit" render={({ input, meta }) => (
              <SelectField id="unit" title="Unit:" list={units} {...input} />
            )}/>
            <Field name="barcode" render={({ input, meta }) => (
              <BarcodeField id="barcode" title="Barcode:" {...input} />
            )}/>
          </ManagmentPopup>
        )
      }
    </section>
  )
}

export default connector(TMCManager);
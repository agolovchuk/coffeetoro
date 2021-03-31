import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field } from 'react-final-form';
import { match } from 'react-router-dom';
import { getId } from 'lib/id';
import {
  InputField,
  SelectField,
  BarcodeField
} from 'components/Form/field';
import { isRequired } from 'components/Form/validate';
import {
  TMCItem,
  CRUD,
  tmcListSelector,
  unitsSelectSelector,
  categoriesListSelector
} from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { Main } from '../../components';
import { categoriesList } from '../../../../modules/category/helpers';
import SetBarcode from './setBarcode';
import Row from "../row";
import { EitherEdit } from '../../Types';
import BoxingField from 'components/Form/Boxing';

function createItem(parentId: string = ''): TMCItem {
  return {
    id: getId(16),
    title: '',
    description: '',
    parentId,
    unitId: '1',
    add: new Date().toISOString(),
    update: null,
    barcode: '',
    boxing: 0,
  }
}

const mapState = (state: AppState) => ({
  tmc: tmcListSelector(state),
  units: unitsSelectSelector(state),
  categories: categoriesListSelector(state),
});

const mapDispatch = {
  create: CRUD.createItemAction,
  update: CRUD.updateItemAction,
  getAll: CRUD.getAllAction,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  match: match<{ category: string }>
}

function TMCManager({ create, update, units, getAll, categories, ...props }: Props) {
  const { category } = props.match.params;

  const handleSubmit = React.useCallback(
    async ({ isEdit, ...value }: EitherEdit<TMCItem>, cb: () => void) => {
      if (isEdit) {
        await update('tmc', value);
      } else {
        await create('tmc', value);
      }
      cb();
    }, [create, update],
  );

  const editAdapter = React.useCallback((value: TMCItem) => ({
    ...value,
    isEdit: true,
    update: new Date().toISOString()
  }), []);

  const optionList = React.useMemo(() => categoriesList(categories), [categories]);

  const createArticleItem = React.useCallback(() => createItem(category), [category]);

  React.useEffect(() => {
    getAll('units');
    getAll('tmc', (category || ''), 'parentId');
  }, [getAll, category]);

  const rowItem = React.useCallback((d) => <Row {...d} />, []);

  return (
    <Main
      list={props.tmc}
      title="Articles"
      createItem={createArticleItem}
      editAdapter={editAdapter}
      handleSubmit={handleSubmit}
      popupTitle="Add Article"
      createLink={rowItem}
    >
      <Field name="parentId" render={({ input }) => (
        <SelectField
          list={optionList}
          id="parentId"
          title="Category"
          {...input}
        />
      )}/>
      <Field name="title" render={({ input}) => (
        <InputField id="title" title="Title:" {...input} />
      )}/>
      <Field name="description" render={({ input}) => (
        <InputField id="description" title="Description:" {...input} />
      )}/>
      <BoxingField units={units} label="Упаковка:" />
      <Field
        name="barcode"
        validate={isRequired}
        render={({ input, meta}) => (
        <BarcodeField
          id="barcode"
          meta={{ error: meta.error, touched: meta.touched}}
          title="Barcode:"
          {...input}
        >
          <SetBarcode />
        </BarcodeField>
      )}/>
    </Main>
  )
}

export default connector(TMCManager);

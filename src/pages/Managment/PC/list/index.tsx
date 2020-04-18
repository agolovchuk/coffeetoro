import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field } from 'react-final-form';
import { getId } from 'lib/id';
import { InputField } from 'components/Form/field';
import { ProcessCardItem, CRUD, processCardsListSelector } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { ManagmentPopup, ItemList, Header, MItem } from '../../components';
import { getTitle } from '../../helper';
import { EitherEdit } from '../../Types';

function createItem(): ProcessCardItem {
  return {
    id: getId(12),
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

  const [item, setItem] = React.useState<EitherEdit<ProcessCardItem> | null>(null);

  const handleSubmit = React.useCallback(
    ({ isEdit, ...value }: EitherEdit<ProcessCardItem>) => {
      if (isEdit) {
        update('processCards', value);
      } else {
        create('processCards', value);
      }
      setItem(null);
    }, [create, update],
  );

  const handleCreat = () => setItem(createItem());
  const handleEdit = (value: ProcessCardItem) => setItem({ ...value, isEdit: true, update: new Date().toISOString() });

  const createLink = React.useMemo(() => {
    return (data: ProcessCardItem) => ['/manager', 'pc', data.id].join('/');
  }, []);

  React.useEffect(() => {
    getAll('units');
    getAll('processCards');
  }, [getAll]);

  return (
    <section className="scroll-section">
      <Header title="Process Card" onCreate={handleCreat} />
      <ItemList list={props.pc} getKey={e => e.id}>
        {
          (data) => (
            <MItem
              data={data}
              title={getTitle(data)}
              getLink={createLink}
              onEdit={handleEdit}
            />
          )
        }
      </ItemList>
      {
        item && (
          <ManagmentPopup
            title="Add Process Card"
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
          </ManagmentPopup>
        )
      }
    </section>
  )
}

export default connector(ProcessCardList);

import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field, useForm } from 'react-final-form';
import { servicesListSelector, CRUD } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { SelectField, orderByTitle } from 'components/Form/field';
import { getTitle } from '../../helper';

const mapState = (state: AppState) => ({
  list: servicesListSelector(state),
})

const mapDispatch = {
  getList: CRUD.getAllAction
}

const SELECT = { name: 'null', disabled: true, title: 'Pic' };

const connector = connect(mapState, mapDispatch)

interface Props extends ConnectedProps<typeof connector> {
  updateAdapter: (d: any) => any,
};

function ProcessCardSelector({ list, getList, updateAdapter }: Props) {

  const { initialize, getState } = useForm();

  React.useEffect(() => {
    getList('services');
    initialize(updateAdapter(getState().values));
  }, [getList, initialize, getState, updateAdapter]);

  const itemsList = React.useMemo(() =>
      [SELECT, ...list.map(({ id, ...rest }) => ({ name: id, title: getTitle(rest) })).sort(orderByTitle)],
    [list]);

  return (
    <div>
      <Field
        name="refId"
        render={({ input, meta }) => (
          <SelectField
            id="refId"
            title="Services:"
            list={itemsList}
            {...input}
          />
        )}
      />
    </div>
  )
}

export default connector(ProcessCardSelector);

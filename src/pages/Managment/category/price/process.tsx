import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Field, useForm } from 'react-final-form';
import { processCardsListSelector, CRUD } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import { SelectField } from 'components/Form/field';
import { getTitle } from '../../helper';

const mapState = (state: AppState) => ({
  pc: processCardsListSelector(state),
})

const mapDispatch = {
  getCards: CRUD.getAllAction
}

const SELECT = { name: 'null', disabled: true, title: 'Pic' };

const connector = connect(mapState, mapDispatch)

interface Props extends ConnectedProps<typeof connector> {};

function ProcessCardSelector({ pc, getCards }: Props) {

  const { initialize, getState } = useForm();

  React.useEffect(() => {
    getCards('processCards');
    const { values: { type, barcode, ...rest } } = getState();
    initialize({ refId: 'null', ...rest, type: 'pc' });
  }, [getCards, initialize, getState]);

  const cardList = React.useMemo(() => 
    [SELECT, ...pc.map(({ id, ...rest }) => ({ name: id, title: getTitle(rest) }))],
  [pc]);

  return (
    <div>
      <Field
        name="refId"
        render={({ input, meta }) => (
          <SelectField
            id="refId"
            title="Process Card:"
            list={cardList}
            {...input}
          />
        )}
      />
    </div>
  )
}

export default connector(ProcessCardSelector);
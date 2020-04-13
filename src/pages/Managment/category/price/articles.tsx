import * as React from 'react';
import { Field, useField, useForm } from 'react-final-form';
import { InputField } from 'components/Form/field';
import CDB from 'db';
import { BarcodeField } from 'components/Form/field';

interface Item {
  title: string;
  description: string | undefined;
  unit: {
    title: string;
  };
}

function ArticleSelector() {

  const [item, setItem] = React.useState<Item | null>(null);

  const handlSearch = React.useCallback(async (barcode: string) => {
    const idb = new CDB();
    const tmc = await idb.getArticleByBarcode(barcode);
    setItem(tmc);
  }, []);

  const { input: { value: barcode }} = useField('barcode', { subscription: { value: true }});

  const { initialize, getState } = useForm();
  
  React.useEffect(() => {
    if (barcode) {
      handlSearch(barcode);
    }
    const { values: { type, refId, ...rest } } = getState();
    initialize({ ...rest, type: 'tmc', barcode: barcode || '' });
  }, [barcode, handlSearch, getState, initialize]);

  return (
    <div>
      <Field name="barcode"
        render={({ input, meta }) => (
          <BarcodeField
            id="barcode"
            title="Barcode:"
            {...input}
          />
        )}
      />
      {
        item && (
          <React.Fragment>
            <InputField id="Title" title="Title" name="title" value={item.title} readOnly />
            {
              item.description && (
                <InputField
                  id="description"
                  title="description"
                  name="description"
                  value={item.description}
                  readOnly
                />
              )
            }
            <InputField id="unit" title="unit" name="unit" value={item.unit.title} readOnly />
          </React.Fragment>
        )
      }
    </div>
  )
}

export default ArticleSelector;

import * as React from 'react';
import { Field, useField, useForm } from 'react-final-form';
import { InputField } from 'components/Form/field';
import { TMCItem } from 'domain/dictionary';
import Search from '../add';
import CDB from 'db';
import { BarcodeField } from 'components/Form/field';
import styles from './articles.module.css';

interface Item {
  title: string;
  description: string | undefined;
  unit: {
    title: string;
  };
}

interface Props {
  updateAdapter: (d: any, args?: any) => any,
}

function ArticleSelector({ updateAdapter }: Props) {

  const [item, setItem] = React.useState<Item | null>(null);

  const handelSearch = React.useCallback(async (barcode: string) => {
    const idb = new CDB();
    const tmc = await idb.getArticleByBarcode(barcode);
    setItem(tmc);
  }, []);

  const { input: { value: barcode }} = useField('barcode', { subscription: { value: true }});

  const { initialize, getState, change } = useForm();

  React.useEffect(() => {
    if (barcode) {
      handelSearch(barcode);
    }
    initialize(updateAdapter(getState().values, { barcode }));
  }, [barcode, handelSearch, getState, initialize, updateAdapter]);

  const searchHandler = React.useCallback(({ barcode }: TMCItem) => {
    change('barcode', barcode);
  }, [change]);

  return (
    <div className={styles.container}>
      <Field name="barcode"
        render={({ input, meta }) => (
          <div className={styles.search}>
            <BarcodeField
              id="barcode"
              title="Barcode:"
              {...input}
            />
            <Search onAdd={searchHandler} />
          </div>
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

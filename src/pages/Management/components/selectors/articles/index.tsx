import * as React from 'react';
import { Field, useField, useForm } from 'react-final-form';
import { TMCItem } from 'domain/dictionary';
import Search from '../add';
import CDB from 'db';
import { BarcodeField } from 'components/Form/field';
import { isRequired } from 'components/Form/validate';
import styles from './articles.module.css';
import { getTitle } from '../../../helper';

interface Item {
  title: string;
  description: string | undefined;
  unit: {
    title: string;
  };
}

interface Props {
  updateAdapter: (d: any, args?: any) => any,
  onPicItem?: (item: TMCItem) => void;
}

function ArticleSelector({ updateAdapter, onPicItem }: Props) {

  const [item, setItem] = React.useState<Item | null>(null);

  const handelSearch = React.useCallback(async (barcode: string) => {
    const idb = new CDB();
    const tmc = await idb.getArticleByBarcode(barcode);
    setItem(tmc);
    if (typeof onPicItem === "function" && tmc) onPicItem(tmc);
  }, [onPicItem]);

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
      <Field
        name="barcode"
        validate={isRequired}
        render={({ input, meta }) => (
          <div className={styles.search}>
            <BarcodeField
              id="barcode"
              meta={{ error: meta.error, touched: meta.touched }}
              title="Barcode:"
              {...input}
            />
            <Search onAdd={searchHandler} />
          </div>
        )}
      />
      {
        item && (
          <div className={styles.line}>{getTitle(item)}</div>
        )
      }
    </div>
  )
}

export default ArticleSelector;

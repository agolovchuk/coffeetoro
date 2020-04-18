import * as React from 'react';
import CDB from 'db';
import { TMCItem } from 'domain/dictionary';
import Search from 'components/Form/Search';
import { searchValidator } from '../helpers';
import { getTitle } from '../../../helper';
import styles from './add.module.css';

interface Props {
  onAdd(item: { item: TMCItem, quantity: number }): void
}

function AddItem({ onAdd }: Props) {

  const db = React.useRef(new CDB());

  const [isSearching, setSearchDialog] = React.useState(false);

  const handleSelect = React.useCallback((data: TMCItem) => {
    onAdd({ item: data, quantity: 0 });
  }, [onAdd]);

  const handleSearch = React.useCallback((term: string) => {
    const validator = ({ title }: TMCItem) => searchValidator(term, title);
    return db.current.searchArticle(validator);
  }, []);

  return (
    <div className={styles.container}>
      <button
        className="button_add"
        type="button"
        onClick={() => setSearchDialog(true)}
      />
      {
        isSearching ? (
          <Search
            onChange={handleSelect}
            onSearch={handleSearch}
            onCancel={() => setSearchDialog(false)}
            getKey={d => d.id}
            getTitle={getTitle}
          />
        ) : null
      }
    </div>
  );
}

export default AddItem;

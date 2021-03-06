import * as React from 'react';
import CDB from 'db';
import { TMCItem } from 'domain/dictionary';
import Search from 'components/Form/Search';
import { searchValidator } from './helpers';
import { getTitle } from '../../../../pages/Management/helper';
import styles from './add.module.css';

interface Props {
  onAdd(data: TMCItem): void
}

function AddItem({ onAdd }: Props) {

  const db = React.useRef(new CDB());

  const [isSearching, setSearchDialog] = React.useState(false);

  const handleSearch = React.useCallback((term: string) => {
    const validator = ({ title }: TMCItem) => searchValidator(term, title);
    return db.current.searchArticle(validator);
  }, []);

  return (
    <div className={styles.container}>
      <button
        className="btn__add"
        type="button"
        onClick={() => setSearchDialog(true)}
      />
      {
        isSearching ? (
          <Search
            onChange={onAdd}
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

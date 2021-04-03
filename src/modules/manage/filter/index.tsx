import * as React from "react";
import styles from "./filter.module.css";

type FilterState = 'bank' | 'cash' | undefined;

interface Props {
  onChange(d: FilterState): void,
  value: FilterState,
}

function Filter({ onChange, value }: Props) {

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.id as FilterState;
    const v = event.target.checked ? name : undefined;
    onChange(v)
  }, [onChange ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <input
          type="checkbox"
          id="bank"
          onChange={handleChange}
          className={styles.field}
          checked={value === 'bank'}
        />
        <label htmlFor="bank" className={styles.label}>Bank</label>
      </div>
      <div className={styles.container}>
        <input
          type="checkbox"
          id="cash"
          onChange={handleChange}
          className={styles.field}
          checked={value === 'cash'}
        />
        <label htmlFor="cash" className={styles.label}>Cash</label>
      </div>
    </div>
  );
}

export default Filter;

import * as React from 'react';
import styles from './search.module.css';

interface Props<T> {
  onSearch(t: string): Promise<ReadonlyArray<T>>;
  onChange(data: T): void;
  onCancel(): void;
  getTitle(data: T): string;
  getKey(data: T): string;
}

function Search<T>({ onChange, onSearch, onCancel, ...props }: Props<T>) {

  const container = React.useRef<HTMLDivElement | null>(null)

  const field = React.useRef<HTMLInputElement | null>(null)

  const [value, setValue] = React.useState('');

  const [list, setList] = React.useState<ReadonlyArray<T>>([]);

  const animate = React.useCallback((state: boolean, cb: () => void = () => {}) => {
    const value = state ? 'translate3d(0, 0, 0)' : null;
    const complete = () => {
      if (container.current) {
        container.current.removeEventListener('transitionend', complete);
      }
      cb();
    }
    if (container.current) {
      container.current.addEventListener('transitionend', complete, false);
      container.current.style.setProperty('transform', value);
    }
    // TODO: Update animation on a first step
  }, []);

  const handleChange = React.useCallback(async(e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
    const res = await onSearch(value);
    setList(res);
  }, [onSearch]);

  const handleCancel = React.useCallback(() => {
    animate(false, onCancel);
  }, [onCancel, animate]);

  const handleSelect = React.useCallback((data: T) => {
    animate(false, () => { onChange(data); onCancel(); });
  }, [onChange, onCancel, animate]);

  React.useEffect(() => {
    animate(true);
    if (field.current) {
      field.current.focus();
    }
  }, [animate]);

  return (
    <div className={styles.container}>
      <div ref={container} className={styles.content}>
        <div className={styles.wrapper}>
          <input
            ref={field}
            className={styles.field}
            type="search" value={value}
            onChange={handleChange}
          />
          <button onClick={handleCancel} className={styles.btn}>Cancel</button>
        </div>
        <ul className={styles.list}>
          {
            list.map(e => (
              <li key={props.getKey(e)} className={styles.item}>
                <button
                  className={styles.option}
                  type="button"
                  onClick={() => handleSelect(e)}
                >{props.getTitle(e)}</button>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}
export default Search;

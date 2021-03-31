import { memo } from 'react'

interface Props<T> {
  list: ReadonlyArray<T>;
  getKey(el: T): string;
  children(el: T): JSX.Element; 
}

function Grid<T>({ list, getKey, children }: Props<T>) {
  return (
    <ul className="grid__container">
      {
        list.map((e) =>
          <li key={getKey(e)} className="grid__item">
            {children(e)}
          </li>
        )
      }
    </ul>
  );
}

export default memo(Grid);
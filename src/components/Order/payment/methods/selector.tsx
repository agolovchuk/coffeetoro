import { useCallback } from "react";
import cx from "classnames";
import styles from "./methods.module.scss";
import { PopupHeader } from "components/Popup";
import { Props } from './Types';

export default function MethodSelector({ accounts, setMethod }: Props) {

  const btnClass = useCallback(
    (cashLess: boolean) => cx(styles.tile, styles[cashLess ? 'bank' : 'cash']),
    [],
  );

  const handleClick = useCallback((id: string) => () => setMethod(id), [setMethod]);

  return (
    <section className={cx(styles.frame, styles.method)}>
      <PopupHeader title="Способ оплаты" />
      <div className={styles.btnGroup}>
        {
          accounts.map(e => (
            <button
              type="button"
              key={e.id}
              className={btnClass(e.cashLess)}
              onClick={handleClick(e.id)}
            >{e.name}</button>
          ))
        }
      </div>
    </section>
  );
}

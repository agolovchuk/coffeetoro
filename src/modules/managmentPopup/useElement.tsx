import { useCallback } from 'react';
import cx from "classnames";
import * as React from "react";

interface IUseElement {
  children: React.ReactNode;
  styles: Record<string, string>;
  onCancel():void;
}

function useElement({ children, styles, onCancel }: IUseElement) {

  const form = useCallback(({ handleSubmit, submitting, ...rest }) => (
      <form onSubmit={handleSubmit}>
        {
          children
        }
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={cx(styles.btn, styles.cancel)}
            onClick={onCancel}
          >Cancel</button>
          <button
            type="submit"
            disabled={submitting}
            className={cx(styles.btn, styles.ok)}
          >Ok</button>
        </div>
      </form>
    ),
    [children, onCancel, styles],
  );

  return {
    form,
  }
}

export default useElement;

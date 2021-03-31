import * as React from 'react';
import cx from 'classnames';
import { useForm } from 'react-final-form';
import styles from './tmc.module.css';

function SetBarcode() {
  const { change, getState } = useForm();

  const handlePastBarcode = React.useCallback(() => {
    const barcode = getState().values.id;
    change('barcode', barcode);
  }, [change, getState]);

  return (
    <button
      type="button"
      className={cx('btn__generate', styles.generate)}
      onClick={handlePastBarcode}
    />
  )
}

export default SetBarcode;

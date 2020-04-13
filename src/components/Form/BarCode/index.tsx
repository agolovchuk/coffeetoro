import * as React from 'react';
import { BarcodeField } from '../field';
import styles from './barcode.module.css';

interface Props {
  onComplete: (v: string, cb: (r: boolean) => void) => void;
}

function BarCode({ onComplete }: Props) {

  const [value, setValue] = React.useState<string>('');

  const input = React.useRef<HTMLInputElement>();

  const handleRes = React.useCallback((res: boolean) => {
    setValue('');
  }, []);

  const handleComplete = React.useCallback((value: string) => {
    onComplete(value, handleRes);
  }, [onComplete, handleRes]);

  return (
    <BarcodeField
      ref={input}
      id="fast-add"
      title="Barcode:"
      name="barcode"
      onChange={({ target }) => setValue(target.value)}
      value={value}
      onComplete={handleComplete}
      inputClassName={styles.barcode}
      labelClassName={styles.barLabel}
    />
  );
}

export default BarCode;

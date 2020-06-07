import * as React from 'react';
import  cx from 'classnames';
import { BarcodeField } from '../field';
import styles from './barcode.module.css';

interface Props {
  onComplete: (v: string, cb: (r: boolean) => void) => void;
}

interface State {
  value: string;
  error: boolean;
}

const initialState: State = {
  value: '',
  error: false,
}

type Action = {
  type: 'setValue';
  value: string;
} | {
  type: 'setError';
} | {
  type: 'clearError';
}

function  reducer(state: State, action: Action) {
  switch (action.type) {
    case "setError":
      return { value: state.value, error: true };
    case "setValue":
      return { value: action.value, error: false };
    case "clearError":
      return  {value: '', error: false };
    default:
      throw new Error('unexpectable action');
  }
}

function BarCode({ onComplete }: Props) {

  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(reducer, initialState);

  const input = React.useRef<HTMLInputElement>();

  const handleValue = React.useCallback((e) => {
    dispatch({ type: 'setValue', value: e.target.value });
  }, []);

  const handleError = React.useCallback(() => {
    dispatch({ type: 'setError'});
    setTimeout(() => {
      dispatch({ type: 'clearError'});
    }, 1000);
  }, []);

  const handleRes = React.useCallback((res: boolean) => {
    if (!res) {
      handleError();
    } else {
      dispatch({ type: 'setValue', value: '' });
    }
  }, [handleError]);

  const handleComplete = React.useCallback((value: string) => {
    onComplete(value, handleRes);
  }, [onComplete, handleRes]);

  return (
    <BarcodeField
      ref={input}
      id="fast-add"
      title="Barcode:"
      name="barcode"
      onChange={handleValue}
      value={state.value}
      onComplete={handleComplete}
      meta={{ error: '', touched: state.error }}
      inputClassName={styles.barcode}
      labelClassName={styles.barLabel}
      containerClassName={styles.container}
    />
  );
}

export default BarCode;

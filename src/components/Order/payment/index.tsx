import * as React from 'react';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Popup } from 'components/Popup';
import styles from './payment.module.css';
import { CRUD, ACCOUNT, paymentMethodsSelector } from 'domain/dictionary';
import { PaymentMethod } from 'domain/orders/Types';
import { MethodSelector, useElements } from './methods';

interface Props {
  onCancel: () => void,
  onComplete: (method: PaymentMethod.Opened | string) => void,
  valuation: number,
}

function Payment({ onCancel, onComplete, valuation }: Props) {

  const dispatch = useDispatch();

  const paymentMethods = useSelector(paymentMethodsSelector);

  React.useEffect(() => {
    dispatch(CRUD.getAllAction(ACCOUNT));
  }, [dispatch]);

  const [method, setMethod] = React.useState<PaymentMethod.Opened | string>(PaymentMethod.Opened);

  const resetMethod = React.useCallback(() => setMethod(PaymentMethod.Opened), [setMethod]);

  const { selectedMethod } = useElements({
    valuation,
    onCancel: resetMethod,
    method,
    accounts: paymentMethods,
  });

  return (
    <Modal>
      <Popup onCancel={onCancel}>
        <div className={cx(styles.container)}>
          <div className={cx(styles.wrapper, {
            [styles.checkout]: method !== PaymentMethod.Opened,
          })}>
            <MethodSelector accounts={paymentMethods} setMethod={setMethod} />
            {
              selectedMethod
            }
          </div>
          <div className={styles.btnGroup}>
            <button
              className={cx(styles.btn, styles.cancel)}
              type="button"
              onClick={onCancel}
            >Cancel</button>
            {
              method !== PaymentMethod.Opened ? (
                <button
                  className={cx(styles.btn, styles.pay)}
                  type="button"
                  onClick={() => onComplete(method)}
                >Ok</button>
              ) : null
            }
          </div>
        </div>
      </Popup>
    </Modal>
  )
}

export default Payment;

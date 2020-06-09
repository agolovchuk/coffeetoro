import * as React from 'react';
import cx from 'classnames';
import { Modal, Popup, PopupHeader } from 'components/Popup';
import Title from './title';
import PaymentCash from './cash';
import styles from './payment.module.css';
import { PaymentMethod } from 'domain/orders/Types';

interface Props {
  onCancel: () => void,
  onComplete: (method: PaymentMethod) => void,
  valuation: number,
}

function Payment({ onCancel, onComplete, valuation }: Props) {
  const [method, setMethod] = React.useState(PaymentMethod.Opened);
  return (
    <Modal>
      <Popup onCancel={onCancel}>
        <div className={cx(styles.container)}>
          <div className={cx(styles.wrapper, {
            [styles.checkout]: method !== PaymentMethod.Opened,
          })}>
            <section className={cx(styles.frame, styles.method)}>
              <PopupHeader title="Способ оплаты" />
              <div className={styles.btnGroup}>
                <button
                  type="button"
                  className={cx(styles.tile, styles.cash)}
                  onClick={() => setMethod(PaymentMethod.Cash)}
                >Наличные</button>
                <button
                  type="button"
                  className={cx(styles.tile, styles.bank)}
                  onClick={() => setMethod(PaymentMethod.Bank)}
                >Карта</button>
              </div>
            </section>
            {
              method === PaymentMethod.Bank ? (
                <section className={cx(styles.frame, styles.bank)}>
                  <Title
                    onBack={() => setMethod(PaymentMethod.Opened)}
                    title="Банковская карта"
                  />
                </section>
              ) : (
                <PaymentCash
                  onBack={() => setMethod(PaymentMethod.Opened)}
                  valuation={valuation}
                />
              )
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

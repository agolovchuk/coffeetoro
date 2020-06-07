import * as React from "react";
import { Form, Field } from 'react-final-form';
import { PriceField } from 'components/Form/field'
import { Modal, Popup, PopupHeader } from 'components/Popup';
import styles from './daily.module.css';

interface Item {
  cash: number
}

interface Props {
  onCancel: () => void;
  setParams: (data: Item) => void;
  dayBefore: Item;
  currentCache: number;
}

function DailyReport({ onCancel, setParams, dayBefore, currentCache }: Props) {

  const onSubmit = React.useCallback((item) => {
    setParams(item)
  }, [setParams]);

  const initial = React.useMemo(() => ({
    cash: dayBefore.cash - 250000 + (currentCache * 1000),
  }), [dayBefore, currentCache]);

  return (
    <Modal>
      <Popup onCancel={onCancel}>
        <PopupHeader title="Закрытие смены" />
        <div className={styles.content}>
          <Form onSubmit={onSubmit} initialValues={initial} render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Field
                name="cash"
                render={({ input, meta }) => (
                  <PriceField id="cash" title="Сумма в кассе:" {...input} />
              )}/>
              <div className={styles.btnGroup}>
                <button type="button" onClick={onCancel} className={styles.close}>Cancel</button>
                <button type="submit" className={styles.ok}>Ok</button>
              </div>
            </form>
          )}/>
        </div>
      </Popup>
    </Modal>
  );
}

export default DailyReport;

import * as React from "react";
import { Field, Form } from "react-final-form";
import { Modal, Popup, PopupHeader } from "components/Popup";
import cx from "classnames";
import styles from "./discount.module.css";
import { PriceField, SelectField } from "components/Form/field";
import { DiscountItem } from '../Types';

interface Props {
  onCancel: () => void;
  orderId: string;
  onAddDiscount: (data: DiscountItem) => void;
}

const TYPE = [
  { name: 'null', title: 'pic', disabled: true },
  { name: '000001', title: 'Бариста' },
  { name: '000002', title: 'Клиент' },
]

function Discount({ onCancel, orderId, onAddDiscount }: Props) {

  const onSubmit = React.useCallback((item) => {
    onAddDiscount(item)
  }, [onAddDiscount]);

  const initial = React.useMemo(() => ({
    orderId,
    discountId: 'null',
    valuation: 0,
  }), [orderId]);

  return (
    <Modal>
      <Popup onCancel={onCancel}>
        <div className={cx(styles.container)}>
          <PopupHeader title="Скидка" />
          <Form onSubmit={onSubmit} initialValues={initial} render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Field name="discountId" render={({ input}) => (
                <SelectField
                  list={TYPE}
                  id="discountId"
                  title="Назначение:"
                  {...input}
                />
              )}/>
              <Field name="valuation" render={({ input, meta }) => (
                <PriceField id="valuation" title="Сумма:" {...input} />
              )}/>
              <div className={styles.btnGroup}>
                <button type="button" onClick={onCancel} className={styles.close}>Закрыть</button>
                <button type="submit" className={styles.ok}>Ok</button>
              </div>
            </form>
          )}/>
        </div>
      </Popup>
    </Modal>
  );
}

export default Discount;

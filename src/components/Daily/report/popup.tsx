import * as React from "react";
import { Modal, Popup, PopupHeader } from "components/Popup";
import styles from "./daily.module.css";
import {Field, Form} from "react-final-form";
import { PriceField } from "components/Form/field";
import { DayReportParams } from '../Types';

interface Props {
  onSubmit(d: DayReportParams): void;
  onCancel(): void;
  initial: DayReportParams;
}

function ReportPopup({ onSubmit, onCancel, initial }: Props) {
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
                )}
              />
              <Field
                name="bank"
                render={({ input, meta }) => (
                  <PriceField id="bank" title="Платежный терминал:" {...input} />
                )}
              />
              <Field
                name="salary"
                render={({ input, meta }) => (
                  <PriceField id="salary" title="Заработная плата:" {...input} />
                )}
              />
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

export default ReportPopup;

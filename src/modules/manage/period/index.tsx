import * as React from 'react';
import { Field, Form } from "react-final-form";
import { format, startOfMonth, endOfDay } from 'date-fns';
import { FORMAT } from 'lib/dateHelper';
import { InputField } from "components/Form/field";
import styles from './period.module.css';

export interface Period {
  from: string;
  to: string;
}

interface Props {
  onSubmit(d: Period): void;
  initialValues?: Period,
}

const initial = {
  from: format(startOfMonth(new Date()), FORMAT),
  to: format(endOfDay(new Date()), FORMAT),
}

function SelectPeriod({ onSubmit, initialValues = initial}: Props) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Field name="from" render={({ input}) => (
            <InputField
              id="from"
              title="С:"
              type='date'
              containerClassName={styles.field}
              labelClassName={styles.label}
              inputClassName={styles.input}
              {...input}
            />
          )}/>
          <Field name="to" render={({ input}) => (
            <InputField
              id="to"
              title="По:"
              type='date'
              containerClassName={styles.field}
              labelClassName={styles.label}
              inputClassName={styles.input}
              {...input}
            />
          )}/>
          <button className={styles.btn} type="submit">Ok</button>
        </form>
      )}
    />
  );
}

export default SelectPeriod;

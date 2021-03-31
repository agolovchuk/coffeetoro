import * as React from 'react';
import styles from "./boxing.module.css";
import { Field } from "react-final-form";
import cx from 'classnames';
import { ISelectItem } from '../Types';
import { rulesCompose, isInt, isRequired, isPositive } from '../validate';
import { formatToInt } from '../helper';

interface Props {
  units: ReadonlyArray<ISelectItem>;
  label: string;
}

function BoxingField({ units, label }: Props) {
  return (
    <div className={styles.container}>
      <label htmlFor="boxing" className={styles.label}>{label}</label>
      <Field
        name="boxing"
        validate={rulesCompose(isRequired, isInt, isPositive)}
        format={formatToInt}
        formatOnBlur
        render={({ input, meta}) => (
          <input
            id="boxing"
            type="text"
            className={cx(styles.field, {[styles.error]: meta.error })}
            {...input}
            value={input.value || ''}
            inputMode="decimal"
          />
        )}
      />
      <Field name="unitId" render={({ input}) => (
        <select {...input} className={styles.select}>
          {
            units.map(e => (
              <option key={e.name} disabled={e.disabled} value={e.name}>{e.title}</option>
            ))
          }
        </select>
      )}/>
    </div>
  );
}

export default BoxingField;

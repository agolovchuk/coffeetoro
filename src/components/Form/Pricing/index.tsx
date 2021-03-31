import * as React from 'react';
import { Field } from "react-final-form";
import cx from 'classnames';
import styles from './pricing.module.scss';
import { isRequired, isInt, rulesCompose, isPositive, isFloat } from '../validate';
import { formatToInt, formatToFloat } from '../helper';

interface Props {
  unit: string
}

export function PricingField() {
  return (
    <div className={styles.container}>
      <label htmlFor="valuation" className={cx(styles.label, styles.one)}>Цена:</label>
      <Field
        name="valuation"
        id="valuation"
        validate={rulesCompose(isRequired, isFloat, isPositive)}
        format={formatToFloat}
        formatOnBlur
        render={({ input, meta }) => (
          <React.Fragment>
            <input
              inputMode="decimal"
              type="text"
              className={cx(styles.field, {[styles.error]: meta.error })}
              {...input}
              value={input.value || ''}
            />
          </React.Fragment>
        )}
      />
    </div>
  );
}

function PricingGroup({ unit }: Props) {
  return (
    <div className={styles.price_group}>
      <PricingField />
      <div className={styles.container}>
        <label className={styles.label}>
          за:
          <Field
            name="quantity"
            validate={rulesCompose(isRequired, isInt, isPositive)}
            format={formatToInt}
            formatOnBlur
            render={({ input, meta }) => (
              <input
                inputMode="numeric"
                type="text"
                className={cx(styles.field, {[styles.error]: meta.error })}
                {...input}
                value={input.value || ''}
              />
            )}
          />
          <div className={styles.unit}>{unit}</div>
        </label>
        <label className={styles.label}>
          шаг:
          <Field
            name="step"
            format={formatToInt}
            formatOnBlur
            render={({ input }) => (
              <input
                inputMode="numeric"
                type="text"
                className={styles.field}
                {...input}
                value={input.value || ''}
              />
            )}
          />
        </label>
      </div>
    </div>
  );
}

export default PricingGroup;

import * as React from 'react';
import cx from 'classnames';
import Field from './field';
import styles from './field.module.css';
import { ISelectList } from '../Types';

interface Props {
  id: string;
  title: string;
  list: ISelectList,
}

function SelectField({ id, title, list, ...rest }: Props) {
  return (
    <Field id={id} title={title}>
      <select {...rest} className={cx(styles.field, styles.select)} >
        {
          list.map(e => (
            <option key={e.name} disabled={e.disabled} value={e.name}>{e.title}</option>
          ))
        }
      </select>
    </Field>
  )
}

export default SelectField;

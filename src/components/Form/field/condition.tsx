import * as React from 'react';
import { Field } from 'react-final-form';

interface Props {
  when: string;
  is: string;
  children: React.ReactNode;
}

function Condition({ when, is, children }: Props) {
  return (
    <Field name={when} subscription={{ value: true }}>
      {
        ({ input: { value }}) => (value === is ? children : null )
      }
    </Field>
  )
}

export default Condition;

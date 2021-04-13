import * as React from "react";
import { IAccountItem } from '../Types';
import styles from "./summary.module.css";

function toMoney(m: number) {
  return (m / 1000).toFixed(2);
}

interface Props {
  summary: {
    discount: number;
    income: number;
    orders: number;
  };
  date: string;
  children?: JSX.Element;
  accounts: ReadonlyArray<IAccountItem & { value: number }>;
}

function Summary({ summary, date, children, accounts }: Props) {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Report for {date}</h1>
      {
        children
      }
      <h4>Заказов: {summary.orders}</h4>
      <h4>Всего: {toMoney(summary.income)}</h4>
      <dl className={styles.cache}>
        <dt><h5>Из них</h5></dt>
        <dd>
          {
            accounts.map(e => (
              <div key={e.id}>{e.name}: {toMoney(e.value)}</div>
            ))
          }
          <div>скидка: {toMoney(summary.discount)}</div>
        </dd>
      </dl>
    </div>
  )
}

export default Summary;

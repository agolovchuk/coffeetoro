import * as React from "react";
import styles from "./summary.module.css";

function toMoney(m: number) {
  return (m / 1000).toFixed(2);
}

interface Props {
  summary: {
    cash: number;
    bank: number;
    discount: number;
    income: number;
    orders: number;
  };
  date: string;
  children?: React.ReactNode;
}

function Summary({ summary, date, children }: Props) {
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
          <div>по кассе: {toMoney(summary.cash)}</div>
          <div>по банку: {toMoney(summary.bank)}</div>
          <div>скидка: {toMoney(summary.discount)}</div>
        </dd>
      </dl>
    </div>
  )
}

export default Summary;

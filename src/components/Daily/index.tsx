import * as React from "react";
import cx from 'classnames';
import DayNavigator from "./dayNavigator";
import Item from "./item";
import Order from './order';
import styles from "./report.module.css";

function toMoney(m: number) {
  return (m / 1000).toFixed(2);
}

interface Props {
  getDailyReport(d: string): void;
  completeReport(d: string): void;
  summary: {
    cash: number;
    bank: number;
    discount: number;
    income: number;
    orders: number;
  }
  articles: ReadonlyArray<any>;
  orders: ReadonlyArray<any>;
  date: string;
  children?: React.ReactNode;
  linkPrefix: string;
}

function Report({ children, getDailyReport, summary, completeReport, date, ...props }: Props) {

  React.useEffect(() => {
    getDailyReport(date);
    return () => {
      completeReport(date);
    }
  }, [ getDailyReport, completeReport, date]);

  return (
    <section className={cx("scroll-section", styles.container)}>
      <div  className={styles.column}>
        <div className={styles.header}>
          <h1 className={styles.title}>Report for {date}</h1>
          <DayNavigator date={date} prefix={props.linkPrefix} />
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
        {
          children
        }
      </div>
      <div className={styles.column}>
        <ul className={styles.list}>
          {
            props.articles.map(e => (
              <Item {...e} key={e.id} />
            ))
          }
        </ul>
        <ul className={styles.list}>
          {
            props.orders.map(e => (
              <Order key={e.id} {...e} />
            ))
          }
        </ul>
      </div>
    </section>
  );
}

export default Report;

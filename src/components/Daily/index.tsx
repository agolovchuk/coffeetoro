import * as React from "react";
import cx from 'classnames';
import DayNavigator from "./dayNavigator";
import Item from "./item";
import Order from './order';
import Summary from "./summary/income";
import styles from "./report.module.css";

interface Props {
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

function Report({ children, summary, date, ...props }: Props) {

  return (
    <section className={cx("scroll-section", styles.container)}>
      <div  className={cx(styles.column, styles.wrapper)}>
        <Summary summary={summary} date={date}>
          <DayNavigator date={date} prefix={props.linkPrefix} />
        </Summary>
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

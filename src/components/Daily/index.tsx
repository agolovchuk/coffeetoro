import * as React from "react";
import cx from 'classnames';
import DayNavigator from "./dayNavigator";
import Item from "./item";
import Order from './order';
import Summary from "./summary/income";
import { accountsSummary } from './helpers';
import styles from "./report.module.css";
import { IReportProps } from './Types';

function Report({ children, summary, date, orders, accounts, ...props }: IReportProps) {

  const accountsList = React.useMemo(
  () => accountsSummary(orders, accounts),
  [orders, accounts],
  );

  return (
    <section className={cx("scroll-section", styles.container)}>
      <div  className={cx(styles.column, styles.wrapper)}>
        <Summary summary={summary} date={date} accounts={accountsList}>
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
            orders.map(e => (
              <Order key={e.id} accounts={accounts} {...e} />
            ))
          }
        </ul>
      </div>
    </section>
  );
}

export default Report;

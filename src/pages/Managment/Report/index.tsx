import * as React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { format } from 'date-fns';
import { match } from 'react-router-dom';
import cx from 'classnames';
import {
  getDailyReportAction,
  summarySelector,
  completeReportAction,
  articlesSelector,
  enrichedOrdersSelector,
} from 'domain/reports';
import Item from "./item";
import Order from './order';
import styles from "./report.module.css";

const mapState = (state: any) => ({
  summary: summarySelector(state),
  articles: articlesSelector(state),
  orders: enrichedOrdersSelector(state),
});

const mapDispatch = {
  getDailyReport: getDailyReportAction,
  completeReport: completeReportAction,
};

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector> {
  match: match<{ date: string }>
};

function Report({ getDailyReport, summary, completeReport, match, articles, orders }: Props) {

  const date = React.useMemo(() =>
    match.params.date || format(new Date(), 'yyyy-MM-dd'), [match]);

  React.useEffect(() => {
    getDailyReport(date);
    return () => {
      completeReport(date);
    }
  }, [ getDailyReport, completeReport, date ]);

  return (
    <section className={cx("scroll-section", styles.container)}>
      <h1 className={styles.title}>Report for {date}</h1>
      <h4>Заказов: {summary.orders}</h4>
      <h4>Всего: {summary.income}</h4>
      <dl className={styles.cache}>
        <dt><h5>Из них</h5></dt>
        <dd>
          <div>по кассе: {summary.cash}</div>
          <div>по банку: {summary.bank}</div>
        </dd>
      </dl>
      <div className={styles.column}>
        <ul className={styles.list}>
          {
            articles.map(e => (
              <Item {...e} key={e.id} />
            ))
          }
        </ul>
        <ul className={styles.list}>
          {
            orders.map(e => (
              <Order key={e.id} {...e} />
            ))
          }
        </ul>
      </div>
    </section>
  );
}

export default connector(Report);

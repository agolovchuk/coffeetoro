import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { format, subDays } from 'date-fns';
import cx from 'classnames';
import get from 'lodash/get';

import {
  getDailyReportAction,
  summarySelector,
  completeReportAction,
  articlesSelector,
  enrichedOrdersSelector,
} from 'domain/reports';
import { setDayParamsAction, getDayParamsAction, dailyParamsSelector } from 'domain/daily';
import { AppState } from 'domain/StoreType';
import Item from "./item";
import Order from './order';
import DailyReport from "./report";
import styles from "./report.module.css";

const FORMAT = 'yyyy-MM-dd';
const before = () => format(subDays(new Date(), 1), FORMAT);

const mapState = (state: AppState) => ({
  summary: summarySelector(state),
  articles: articlesSelector(state),
  orders: enrichedOrdersSelector(state),
  dailyParams: dailyParamsSelector(state),
});

const mapDispatch = {
  getDailyReport: getDailyReportAction,
  completeReport: completeReportAction,
  setDayParams: setDayParamsAction,
  getDayParams: getDayParamsAction,
};


const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps<{ date: string }> {};

function Report({ getDailyReport, summary, completeReport, match, articles, orders, setDayParams, history, getDayParams, dailyParams }: Props) {

  const [isReport, setReport] = React.useState(false);

  const dateBefore = React.useMemo(before, []);

  const dayBefore = React.useMemo(() => get(dailyParams, dateBefore), [dailyParams])

  const date = React.useMemo(() =>
    match.params.date || format(new Date(), FORMAT), [match]);

  const createReport = React.useCallback((data) => {
    const date = () => format(new Date(), FORMAT);
    setDayParams(data, date(), () => {
      setReport(false);
      history.replace('/logout');
    });
  }, [setDayParams, history]);

  React.useEffect(() => {
    getDailyReport(date);
    getDayParams(dateBefore);
    return () => {
      completeReport(date);
    }
  }, [ getDailyReport, completeReport, date ]);

  return (
    <section className={cx("scroll-section", styles.container)}>
      <div  className={styles.column}>
        <div className={styles.header}>
          <h1 className={styles.title}>Report for {date}</h1>
          <h4>Заказов: {summary.orders}</h4>
          <h4>Всего: {summary.income}</h4>
          <dl className={styles.cache}>
            <dt><h5>Из них</h5></dt>
            <dd>
              <div>по кассе: {summary.cash}</div>
              <div>по банку: {summary.bank}</div>
              <div>скидка: {summary.discount}</div>
            </dd>
          </dl>
        </div>
        <div className={styles.btnGroup}>
          <button
            className={styles.btn}
            onClick={() => setReport(true)}
          >Закрыть смену</button>
        </div>
      </div>
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
      {
        isReport && (
          <DailyReport
            onCancel={() => setReport(false)}
            setParams={createReport}
            dayBefore={dayBefore}
            currentCache={summary.cash}
          />
        )
      }
    </section>
  );
}

export default connector(Report);

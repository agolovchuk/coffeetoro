import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import { format, subDays } from "date-fns";
// import get from 'lodash/get';
import { AppState } from "domain/StoreType";
import {
  productsSelector,
  completeReportAction,
  enrichedOrdersSelector,
  summarySelector,
  getDailyReportAction,
} from "domain/reports";
import { dailyParamsSelector, getDayParamsAction, setDayParamsAction } from "domain/daily";
import { getExpenseAction, expanseSumSelector } from 'domain/dictionary';
import { closeSessionAction } from 'domain/env';
import Daily from 'components/Daily';
import Report from 'components/Daily/report';
import { DayReportParams } from "components/Daily/Types";
import { FORMAT } from "lib/dateHelper";

const mapState = (state: AppState) => ({
  summary: summarySelector(state),
  articles: productsSelector(state),
  orders: enrichedOrdersSelector(state),
  dailyParams: dailyParamsSelector(state),
  expanseSum: expanseSumSelector(state),
});

const mapDispatch = {
  getDailyReport: getDailyReportAction,
  completeReport: completeReportAction,
  setDayParams: setDayParamsAction,
  getDayParams: getDayParamsAction,
  getExpense: getExpenseAction,
  closeSession: closeSessionAction,
};

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps<{ date: string }> {};

function DailyReport({ match: { params }, closeSession, getDayParams, history, dailyParams, getExpense, expanseSum, getDailyReport, completeReport, ...props }: Props) {

  const { bank } = props.summary;

  const date = React.useMemo(() =>
    params.date || format(new Date(), FORMAT), [params]);

  const addReport = React.useCallback((data: DayReportParams) => {
    closeSession(data, () => { history.replace('/logout'); })
  }, [history, closeSession]);

  const dateBefore = React.useMemo(() => format(subDays(new Date(), 1), FORMAT), []);

  const predictCache = React.useMemo(() => {
    // const before = get(dailyParams, [dateBefore, 'cash']);
    // const c = before - 250000 + cash - get(expanseSum, 'cash', 0);
    return {
      cash: 0,
      bank,
      salary: 0,
    }
  }, [bank]);

  React.useEffect(() => {
    getDayParams(dateBefore);
    getExpense(date);
    getDailyReport(date);
    return () => {
      completeReport(date);
    }
  }, [getDayParams, dateBefore, getExpense, date, getDailyReport, completeReport]);

  return (
    <Daily date={date} linkPrefix="/report" {...props}>
      <Report
        createReport={addReport}
        predict={predictCache}
        date={date}
      />
    </Daily>
  )
}

export default connector(DailyReport);

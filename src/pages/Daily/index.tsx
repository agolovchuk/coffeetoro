import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import { format, subDays } from "date-fns";
import get from 'lodash/get';
import { AppState } from "domain/StoreType";
import {
  articlesSelector,
  completeReportAction,
  enrichedOrdersSelector,
  summarySelector,
  getDailyReportAction,
} from "domain/reports";
import { dailyParamsSelector, getDayParamsAction, setDayParamsAction } from "domain/daily";
import { getExpenseAction, expanseSumSelector } from 'domain/dictionary';
import Daily from 'components/Daily';
import Report from 'components/Daily/report';
import { FORMAT } from "lib/dateHelper";

const mapState = (state: AppState) => ({
  summary: summarySelector(state),
  articles: articlesSelector(state),
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
};

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps<{ date: string }> {};

function DailyReport({ match: { params }, setDayParams, getDayParams, history, dailyParams, getExpense, expanseSum, ...props }: Props) {

  const { cash, bank } = props.summary;

  const date = React.useMemo(() =>
    params.date || format(new Date(), FORMAT), [params]);

  const addReport = React.useCallback((data) => {
    setDayParams(data, date, () => { history.replace('/logout'); })
  }, [history, date, setDayParams]);

  const dateBefore = React.useMemo(() => format(subDays(new Date(), 1), FORMAT), []);

  const predictCache = React.useMemo(() => {
    const before = get(dailyParams, [dateBefore, 'cash']);
    const c = before - 250000 + cash - get(expanseSum, 'cash', 0);
    return {
      cash: c,
      bank,
    }
  }, [dailyParams, dateBefore, cash, bank, expanseSum]);

  React.useEffect(() => {
    getDayParams(dateBefore);
    getExpense(date);
  }, [getDayParams, dateBefore, getExpense, date]);

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

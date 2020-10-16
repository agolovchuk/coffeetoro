import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import { format } from "date-fns";
import { AppState } from "domain/StoreType";
import {
  productsSelector,
  completeReportAction,
  enrichedOrdersSelector,
  getDailyReportAction,
  summarySelector,
  getOrdersAction,
} from "domain/reports";
import { dailyParamsSelector, getDayParamsAction, setDayParamsAction } from "domain/daily";
import Daily from 'components/Daily';
import { FORMAT } from "components/Daily/helpers";

const mapState = (state: AppState) => ({
  summary: summarySelector(state),
  articles: productsSelector(state),
  orders: enrichedOrdersSelector(state),
  dailyParams: dailyParamsSelector(state),
});

const mapDispatch = {
  getDailyReport: getDailyReportAction,
  completeReport: completeReportAction,
  setDayParams: setDayParamsAction,
  getDayParams: getDayParamsAction,
  getOrders: getOrdersAction,
};

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps<{ date: string }> {};

function DailyReport({ match: { params }, getOrders, ...props }: Props) {

  const date = React.useMemo(() =>
    params.date || format(new Date(), FORMAT), [params]);

  React.useEffect(() => {
    getOrders(date);
  }, [getOrders, date]);

  return (
    <Daily date={date} linkPrefix="/manager/reports/daily" {...props} />
  )
}

export default connector(DailyReport);

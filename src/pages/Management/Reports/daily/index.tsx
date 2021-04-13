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
import { accountsByIdSelector, CRUD, ACCOUNT } from 'domain/dictionary';
import Daily from 'components/Daily';
import { FORMAT } from "components/Daily/helpers";

const mapState = (state: AppState) => ({
  summary: summarySelector(state),
  articles: productsSelector(state),
  orders: enrichedOrdersSelector(state),
  dailyParams: dailyParamsSelector(state),
  accounts: accountsByIdSelector(state),
});

const mapDispatch = {
  getDailyReport: getDailyReportAction,
  completeReport: completeReportAction,
  setDayParams: setDayParamsAction,
  getDayParams: getDayParamsAction,
  getOrders: getOrdersAction,
  getAll: CRUD.getAllAction,
};

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps<{ date: string }> {};

function DailyReport({ match: { params }, getOrders, getAll, ...props }: Props) {

  const date = React.useMemo(() =>
    params.date || format(new Date(), FORMAT), [params]);

  React.useEffect(() => {
    getOrders(date);
    getAll(ACCOUNT);
  }, [getAll, getOrders, date]);

  return (
    <Daily date={date} linkPrefix="/manager/reports/daily" {...props} />
  )
}

export default connector(DailyReport);

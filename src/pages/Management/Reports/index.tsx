import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AppState } from "domain/StoreType";
import {
  articlesSelector,
  completeReportAction,
  enrichedOrdersSelector,
  getDailyReportAction,
  summarySelector
} from "domain/reports";
import { dailyParamsSelector, getDayParamsAction, setDayParamsAction } from "domain/daily";
import Daily from 'components/Daily';
import {RouteComponentProps} from "react-router-dom";
import {format} from "date-fns";
import {FORMAT} from "../../../components/Daily/helpers";

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

function DailyReport({ match: { params }, ...props }: Props) {

  const date = React.useMemo(() =>
    params.date || format(new Date(), FORMAT), [params]);

  return (
    <Daily date={date} linkPrefix="/manager/reports" {...props} />
  )
}

export default connector(DailyReport);

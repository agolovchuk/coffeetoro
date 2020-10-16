import * as React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import { format, startOfMonth, endOfDay } from "date-fns";
import cx from "classnames";
import { FORMAT } from "lib/dateHelper";
import { AppState } from "domain/StoreType";
import {
  getOrdersAction,
  summarySelector,
  ordersByDateSelector,
  expSelector,
  getEntryPriceAction,
} from 'domain/reports';
import { expanseSumSelector } from 'domain/dictionary';
import {
  SummaryIncome,
  SummaryExpanse,
} from 'components/Daily/summary';
import SelectPeriod, { Period } from '../../components/period';
import { BarCharts } from './barCharts';
import styles from './con.module.css';

const mapState = (state: AppState) => ({
  summary: summarySelector(state),
  ordersByDate: ordersByDateSelector(state),
  expanseSum: expanseSumSelector(state),
  products: expSelector(state),
});

const mapDispatch = {
  getOrders: getOrdersAction,
  getEntryPrice: getEntryPriceAction,
};

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps {}

function Consolidated({ summary, getOrders, ordersByDate, getEntryPrice, expanseSum, products }: Props) {

  const [date, setDate] = React.useState<Period>({
    from: format(startOfMonth(new Date()), FORMAT),
    to: format(endOfDay(new Date()), FORMAT),
  });

  React.useEffect(() => {
    getOrders(date.from, date.to);
  }, [getOrders, date]);

  React.useEffect(() => {
    getEntryPrice();
  }, [getEntryPrice])

  const handleSetPeriod = React.useCallback(({ from, to }: Period) => {
    setDate({ from, to });
  }, []);

  return (
    <section className={cx("scroll-section")}>
      <div className={styles.column}>
        <SummaryIncome summary={summary} date={`${date.from} ${date.to}`} />
        <SelectPeriod onSubmit={handleSetPeriod} initialValues={date} />
      </div>
      <BarCharts data={ordersByDate} />
      <SummaryExpanse data={products} />
    </section>
  );
}

export default connector(Consolidated);

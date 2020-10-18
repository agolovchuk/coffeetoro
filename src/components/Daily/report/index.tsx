import * as React from "react";
import { isToday } from "date-fns";
import ReportPopup from './popup';
import { DayReportParams } from '../Types';
import cx from 'classnames';
import styles from './daily.module.css';

interface Props {
  predict: {
    cash: number,
    bank: number,
  };
  createReport(data: DayReportParams): void;
  date: string;
  disabled: boolean;
}

function DailyReport({ predict, createReport, date, disabled }: Props) {

  const [isReport, setReport] = React.useState(false);

  const isDayToday = React.useMemo(() => isToday(new Date(date)), [date]);

  const handleCancel = React.useCallback(() => { setReport(false); }, [])

  return (
    <div className={styles.container}>
      <div className={styles.btnGroup}>
        {
          isDayToday ? (
            <button
              className={cx('btn', styles.btn)}
              onClick={() => setReport(true)}
              disabled={disabled}
            >Закрыть смену</button>
          ) : null
        }
        {
          (isDayToday && disabled) && (<div className={styles.warning}>Есть не закрытые ордера</div>)
        }
      </div>
      {
        isReport ? (
          <ReportPopup
            onCancel={handleCancel}
            initial={predict}
            onSubmit={createReport}
          />
        ) : null
      }
    </div>
  );
}

export default DailyReport;

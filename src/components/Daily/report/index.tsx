import * as React from "react";
import { isToday } from "date-fns";
import ReportPopup from './popup';
import { DayReportParams } from '../Types';
import styles from './daily.module.css';

interface Props {
  predictCache: number;
  createReport(data: DayReportParams): void;
  date: string;
}

function DailyReport({ predictCache, createReport, date }: Props) {

  const [isReport, setReport] = React.useState(false);

  const isDayToday = React.useMemo(() => isToday(new Date(date)), [date]);

  const initial = React.useMemo(() => ({
    cash: predictCache,
  }), [predictCache]);

  const handleCancel = React.useCallback(() => { setReport(false); }, [])

  return (
    <div className={styles.container}>
      <div className={styles.btnGroup}>
        {
          isDayToday ? (
            <button
              className={styles.btn}
              onClick={() => setReport(true)}
            >Закрыть смену</button>
          ) : null
        }
      </div>
      {
        isReport ? (
          <ReportPopup
            onCancel={handleCancel}
            initial={initial}
            onSubmit={createReport}
          />
        ) : null
      }
    </div>
  );
}

export default DailyReport;

import * as React from 'react';
import { Link } from "react-router-dom";
import { addDays, format, isToday, subDays } from "date-fns";
import { FORMAT } from '../helpers';
import styles from "./navigator.module.css";

interface Props {
  date: string;
  prefix: string;
}

function DayNavigator({ date, prefix }: Props) {

  const isDayToday = React.useMemo(() => isToday(new Date(date)), [date]);

  return (
    <div className={styles.container}>
      <Link
        className={styles.btn}
        to={`${prefix}/${format(subDays(new Date(date), 1), FORMAT)}`}>Prev</Link>
      <Link
        className={styles.btn}
        to={prefix}>To Day</Link>
      {
        isDayToday ? null : (
          <Link
            className={styles.btn}
            to={`${prefix}/${format(addDays(new Date(date), 1), FORMAT)}`}
          >Next</Link>
        )
      }
    </div>
  );
}

export default DayNavigator

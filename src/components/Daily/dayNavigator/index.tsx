import * as React from 'react';
import { NavLink } from "react-router-dom";
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
      <NavLink
        className={styles.btn}
        to={`${prefix}/${format(subDays(new Date(date), 1), FORMAT)}`}>Prev</NavLink>
      <NavLink
        className={styles.btn}
        activeClassName={styles.active}
        to={prefix}>Today</NavLink>
      {
        isDayToday ? null : (
          <NavLink
            className={styles.btn}
            to={`${prefix}/${format(addDays(new Date(date), 1), FORMAT)}`}
          >Next</NavLink>
        )
      }
    </div>
  );
}

export default DayNavigator

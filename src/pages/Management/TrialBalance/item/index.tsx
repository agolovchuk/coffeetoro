import * as React from "react";

interface Props {
  id: string;
  date: Date;
  about: string | undefined;
  // summa: number,
}

export function BalanceLine({ id, about, date }: Props) {
  return (
    <div>
      <span>{id}</span>
      <span>{about}</span>
      <span>{date.toISOString()}</span>
    </div>
  )
}

export default BalanceLine;

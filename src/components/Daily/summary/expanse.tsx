import * as React from "react";
import get  from 'lodash/get';
import Item from "../item";
// import { Price } from 'components/Units';
import styles from './summary.module.css';

interface TMCItem {
  id: string;
  title: string;
  description?: string;
  valuation: number;
  quantity: number;
  barcode: string;
  p?: {
    s: number;
    q: number;
  }
}

interface PCItem {
  title: string;
  refId: string;
  valuation: number;
  quantity: number;
  primeCost?: number;
}

interface Props {
  data: {
    tmc: ReadonlyArray<TMCItem>,
    pc: ReadonlyArray<PCItem>,
  };
}

function getArticleProfit(v: TMCItem) {
  const p = get(v, ['p']);
  if (typeof p === 'undefined') {
    console.warn(`No Entry Prise for "${v.title}" - ${v.barcode}`);
    return 0;
  }
  return v.valuation - (p.s / p.q);
}

// function getPCProfit(v: PCItem) {
//   const cost = get(v, 'primeCost');
//   if (typeof cost === 'undefined') {
//     console.warn(`No Entry Prise for "${v.title}" - ${v.refId}`);
//     return 0;
//   }
//   return v.valuation - cost;
// }

function SummaryExpanse({ data: { tmc, pc } }: Props) {

  // const t = React.useMemo(() => {
  //   return tmc.reduce((a, v) => a + (getArticleProfit(v) * v.quantity) ,0);
  // }, [tmc]);
  //
  //
  // const p = React.useMemo(() => {
  //   return pc.reduce((a, v) => a + (getPCProfit(v) * v.quantity), 0)
  // }, [pc]);

  return (
    <div>
      <div className={styles.group}>
        {/*<dl className={styles.item}>*/}
        {/*  <dt className={styles.title}>Товары:</dt>*/}
        {/*  <dd><Price value={t} sign /></dd>*/}
        {/*</dl>*/}
        {/*<dl className={styles.item}>*/}
        {/*  <dt className={styles.title}>Производство:</dt>*/}
        {/*  <dd><Price value={p} sign /></dd>*/}
        {/*</dl>*/}
      </div>
      {
        tmc.map(e => (
          <Item
            key={e.id}
            title={e.title}
            description={e.description}
            valuation={getArticleProfit(e)}
            quantity={e.quantity}
          />
        ))
      }
    </div>
  );
}

export default SummaryExpanse;

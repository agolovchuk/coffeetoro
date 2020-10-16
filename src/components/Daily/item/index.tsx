import * as React from "react";
import styles from "./item.module.css";
// import { Price } from "components/Units";

interface Props {
  title: string;
  description?: string;
  valuation: number;
  quantity: number;
  sum?: (valuation: number, quantity: number) => number;
}

function Item({ title, description, quantity, sum = (v, q) => v * q }: Props) {
  return (
    <li className={styles.item}>
      <div className={styles.name}>{title} / {description}</div>
      {/*<Price*/}
      {/*  value={valuation}*/}
      {/*  sign*/}
      {/*  notation="compact"*/}
      {/*  currencyDisplay="narrowSymbol"*/}
      {/*/>*/}
      <div className={styles.quantity}>{quantity}</div>
      {/*<div className={styles.sum}>*/}
      {/*  <Price*/}
      {/*    value={sum(valuation, quantity)}*/}
      {/*    sign*/}
      {/*    notation="compact"*/}
      {/*    currencyDisplay="narrowSymbol"*/}
      {/*  />*/}
      {/*</div>*/}
    </li>
  )
}

export default Item;

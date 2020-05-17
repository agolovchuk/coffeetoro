import * as React from "react";
import styles from "./item.module.css";
import { Price } from "components/Units";

interface Props {
  title: string;
  description?: string;
  valuation: number;
  quantity: number;
}

function Item({ title, description, valuation, quantity }: Props) {
  return (
    <li className={styles.item}>
      <div className={styles.name}>{title} / {description}</div>
      <Price
        value={valuation}
        sign
        notation="compact"
        currencyDisplay="narrowSymbol"
      />
      <div className={styles.quantity}>{quantity}</div>
      <div className={styles.sum}>
        <Price
          value={valuation * quantity}
          sign
          notation="compact"
          currencyDisplay="narrowSymbol"
        />
      </div>
    </li>
  )
}

export default Item;

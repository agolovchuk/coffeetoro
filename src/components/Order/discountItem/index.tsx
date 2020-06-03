import * as React from "react";
import Price from "components/Units/price";
import SlideToDelete from "components/SlideToDelete";
import styles from './discount.module.css';
import { DiscountItem } from '../Types';

type Props = DiscountItem & {
  onRemove: (id: string) => void
}

function Discount({ valuation, discountId, onRemove }: Props) {

  return (
    <SlideToDelete onRemove={() => onRemove(discountId)} className={styles.container}>
      <div className={styles.item}>
        <div>Скидка {discountId === '000001' ? 'Баристы' : 'Клиента' }</div>
        <span>
          -<Price value={valuation} sign currencyDisplay="narrowSymbol" notation="compact" />
        </span>
      </div>
    </SlideToDelete>
  )
}

export default Discount;

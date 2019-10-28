import * as React from 'react';
import Valuation from '../Valuation';
import styles from './product.module.css';
import { ProductApi } from './Types';
import Quantity from '../Quantity';

interface IPrice {
  id: string;
  valuation: number;
}

interface IValuation {
  price: IPrice,
  volume: string,
}

interface IOrderApi {
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
  isChecked: (id: string) => boolean;
}

interface Props {
  title: string;
  name: string;
  valuation: ReadonlyArray<IValuation>;
  orderApi?: IOrderApi,
  onChange: (priceId: string) => void;
  quantity?: number;
}

export const ProductContext = React.createContext<Partial<ProductApi>>({});

function Product({ quantity = 1, ...props }: Props) {
  const changeHandler = (priceId: string) => props.onChange(priceId);
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{props.title}</h3>
      <ul className={styles.valuation}>
        {
          props.valuation.map((e) => (
            <Valuation
              key={e.price.id}
              checked={Boolean(props.orderApi && props.orderApi.isChecked(e.price.id))}
              onChange={changeHandler}
              {...e}
            />
          ))
        }
      </ul>
      {
        props.orderApi ? (
          <Quantity
            quantity={quantity}
            onChange={props.orderApi.onQuantity}
            onRemove={props.orderApi.onRemove}
          />
        ) : null
      }
    </div>
  )
}

export default Product;

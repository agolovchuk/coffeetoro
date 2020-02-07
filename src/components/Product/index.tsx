import * as React from 'react';
import cx from 'classnames';
import Valuation from './Valuation';
import styles from './product.module.css';
import { ProductApi } from './Types';
import Quantity from './Quantity';  
import Confirmation from './Confirmation';

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
  const [confirm, setConfirm] = React.useState(false);

  return (
    <div className={styles.container}>
      {
        props.orderApi ? (
          <button
            type="button"
            className={styles.remove}
            onClick={() => setConfirm(true)}
          />
        ) : null
      }
      <div className={cx(styles.warapper, { [styles.editable]: !props.orderApi })}>
        <div className={styles.params}>
          <h3 className={styles.title}>{props.title}</h3>

        </div>
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
      {
        props.orderApi && confirm ? (
          <Confirmation
            item={props.title}
            onRemove={props.orderApi.onRemove}
            onCancel={() => setConfirm(false)}
          />
        ) : null
      }
    </div>
  )
}

export default Product;

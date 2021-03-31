import * as React from 'react';
import cx from 'classnames';
import Valuation from './Valuation';
import styles from './product.module.css';
import Quantity from './Quantity';
import Confirmation from './Confirmation';
import { ProductApi, IValuation, IOrderApi } from './Types';

interface Props {
  title: string;
  // name: string;
  valuation: ReadonlyArray<IValuation>;
  orderApi?: IOrderApi,
  onChange: (priceId: string) => void;
  quantity?: number;
}

export const ProductContext = React.createContext<Partial<ProductApi>>({});

function Product({ quantity = 1, onChange, ...props }: Props) {

  const changeHandler = React.useCallback(
    (priceId: string) => onChange(priceId),
    [onChange]
  );

  const [confirm, setConfirm] = React.useState(false);

  const onCancel = React.useCallback(() => setConfirm(false), [setConfirm])

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
      <div className={cx(styles.wrapper, { [styles.editable]: !props.orderApi })}>
        <div className={styles.params}>
          <h3>{props.title}</h3>
        </div>
        <ul className={styles.valuation}>
          {
            props.valuation.map((e) => (
              <Valuation
                key={e.price.id}
                checked={Boolean(props.orderApi && props.orderApi.isChecked(e.price.id))}
                onChange={changeHandler}
                inOrder={Boolean(props.orderApi)}
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
            onCancel={onCancel}
          />
        ) : null
      }
    </div>
  )
}

export default Product;

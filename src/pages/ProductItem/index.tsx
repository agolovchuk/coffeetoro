import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { PropsMatch } from 'domain/routes';
import Product from 'components/Product';
import {
  productItemSelector,
  getPricesAction,
} from 'domain/dictionary';
import {
  addItemAction,
  updateQuantityAction,
  removeItemAction,
  OrderItemContainer,
  orderByProductSelector,
} from 'domain/orders';
import { AppState } from 'domain/StoreType';
import styles from './product.module.css';

interface IMatchParams {
  readonly orderId: string;
  readonly category: string;
}

type PropsFromRouter = PropsMatch<IMatchParams>;

const mapState = (state: AppState, props: PropsFromRouter) => ({
  product: productItemSelector(state, props),
  orderByProduct: orderByProductSelector(state, props),
});

const mapDispatch = {
  addItem: addItemAction,
  updateQuantity: updateQuantityAction,
  removeItem: removeItemAction,
  getPrices: getPricesAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface IOrderApi extends PropsFromRouter {
  updateQuantity: (orderId: string, priceId: string, quantity: number) => void;
  removeItem: (orderId: string, priceId: string) => void;
}

interface Props extends PropsFromRedux, PropsFromRouter {};

function orderApi(order: OrderItemContainer, { updateQuantity, removeItem, match }: IOrderApi) {
  const { params: { orderId } } = match;
  return {
    isChecked: (id: string) => order.price.id === id,
    onQuantity: (quantity: number) => updateQuantity(orderId, order.price.id, quantity),
    onRemove: () => removeItem(orderId, order.price.id),
  }
}

function ProductItem({ addItem, orderByProduct, getPrices, ...props }: Props) {
  const { category, orderId } = props.match.params;
  console.log(orderId, '@@@@@');

  const addHandler = React.useCallback(
    (priceId: string) => addItem(orderId, priceId), [orderId, addItem]
  );

  const api = React.useCallback(
    (order: OrderItemContainer) => orderApi(order, props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId, props.updateQuantity, props.removeItem]
  );
  
  React.useEffect(() => {
    getPrices(category);
  }, [getPrices, category]);

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{props.product.title}</h1>
      {
        orderByProduct.map((order) => (
          <Product
            key={order.price.id}
            onChange={() => null}
            title={order.category.title}
            name={order.category.name}
            valuation={props.product.valuation}
            orderApi={api(order)}
            quantity={order.quantity}
          />
        ))
      }
      <Product
        onChange={addHandler}
        {...props.product}
      />
    </section>
  );
}

export default connector(ProductItem);

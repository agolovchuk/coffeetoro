import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { PropsMatch } from 'domain/routes';
import Product from 'components/Product';
import {
  productItemSelector,
  getPricesByCategoryAction,
  getCategoryAction,
} from 'domain/dictionary';
import {
  addItemAction,
  updateQuantityAction,
  removeItemAction,
  OrderItemContainer,
  orderByProductSelector,
} from 'domain/orders';
import Articles from './list';
import { AppState } from 'domain/StoreType';
import styles from './product.module.css';

interface IMatchParams {
  readonly orderId: string;
  readonly categoryId: string;
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
  getPrices: getPricesByCategoryAction,
  getCategory: getCategoryAction,
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

function ProductItem({ addItem, getPrices, orderByProduct, getCategory, ...props }: Props) {
  const { categoryId, orderId } = props.match.params;

  const addHandler = React.useCallback(
    (priceId: string) => addItem(orderId, priceId), [orderId, addItem]
  );

  const api = React.useCallback(
    (order: OrderItemContainer) => orderApi(order, props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId, props.updateQuantity, props.removeItem]
  );

  React.useEffect(() => {
    getPrices(categoryId);
    getCategory(categoryId);
  }, [getPrices, categoryId, getCategory]);

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{props.product.title}</h1>
      {
        orderByProduct.map((order) => (
          <Product
            key={order.price.id}
            onChange={() => null}
            title={order.price.title}
            valuation={props.product.valuation}
            orderApi={api(order)}
            quantity={order.quantity}
          />
        ))
      }
      <Articles
        onChange={addHandler}
        valuation={props.product.valuation}
      />
    </section>
  );
}

export default connector(ProductItem);

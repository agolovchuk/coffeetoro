import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import get from 'lodash/get';
import { PropsMatch } from 'domain/routes';
import Product from 'components/Product';
import {
  productItemSelector,
  productItemByNameSelector,
  CRUD,
} from 'domain/dictionary';
import {
  addItemAction,
  updateQuantityAction,
  removeItemAction,
  ordersSelector,
  OrderItemContainer,
  orderByProductSelector,
} from 'domain/orders';
import { AppState } from 'domain/StoreType';
import styles from './product.module.css';

interface IMatchParams {
  readonly orderId: string;
  readonly category: string;
  readonly product: string;
}

type PropsFromRouter = PropsMatch<IMatchParams>;

const mapState = (state: AppState, props: PropsFromRouter) => ({
  products: productItemSelector(state, props),
  orders: ordersSelector(state, props),
  orderByProduct: orderByProductSelector(state, props),
  productsByName: productItemByNameSelector(state, props),
});

const mapDispatch = {
  addItem: addItemAction,
  updateQuantity: updateQuantityAction,
  removeItem: removeItemAction,
  getDictionary: CRUD.getAllAction,
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

function ProductItem({ addItem, orderByProduct, productsByName, getDictionary, ...props }: Props) {
  const { category, orderId, product } = props.match.params;

  const addHandler = React.useCallback((priceId: string) => addItem(
    orderId,
    priceId,
    1,
  ), [orderId, addItem]);

  const api = React.useCallback(
    (order: OrderItemContainer) => orderApi(order, props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId, props.updateQuantity, props.removeItem]
  );
  
  React.useEffect(() => {
    getDictionary('prices', product, 'productName');
  }, [getDictionary, product]);

  React.useEffect(() => {
    getDictionary('products', category, 'categoryName');
  }, [getDictionary, category]);

  return (
    <section className={styles.container}>
      {
        orderByProduct.map((order) => (
          <Product
            key={order.product.name + order.volume.name}
            onChange={() => null}
            title={order.product.title}
            name={order.product.name}
            valuation={get(productsByName, [order.product.name, 'valuation'], [])}
            orderApi={api(order)}
            quantity={order.quantity}
          />
        ))
      }
      {
        props.products.map((product) => (
          <Product
            key={product.id}
            onChange={addHandler}
            {...product}
          />
        ))
      }
    </section>
  );
}

export default connector(ProductItem);

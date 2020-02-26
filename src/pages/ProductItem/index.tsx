import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
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
  const { match: { params }} = props;

  const addHandler = React.useCallback((priceId: string) => addItem(
    params.orderId,
    priceId,
    1,
  ), [params, addItem]);

  const api = React.useCallback(
    (order: OrderItemContainer) => orderApi(order, props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.orderId, props.updateQuantity, props.removeItem]
  );
  
  React.useEffect(() => {
    getDictionary('units');
    getDictionary('prices', params.product, 'productName');
    getDictionary('products', params.category, 'categoryName');
  }, [getDictionary, params]);

  return (
    <section className={styles.container}>
      {
        orderByProduct.map((order) => (
          <Product
            key={order.product.name + order.volume.name}
            onChange={() => null}
            title={order.product.title}
            name={order.product.name}
            valuation={productsByName[order.product.name].valuation}
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

import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router-dom';
import Product from 'components/Product';
import {
  productItemSelector,
  ProductForSale,
  productItemByNameSelector,
} from 'domain/dictionary';
import {
  addItemAction,
  updateQuantityAction,
  updateItemAction,
  removeItemAction,
  ordersSelector,
  OrderItemContainer,
  orderByProductSelector,
  getOrderAction,
} from 'domain/orders';
import { AppState } from 'domain/StoreType';
import styles from './product.module.css';

interface IMatchParams {
  readonly orderId: string;
  readonly category: string;
  readonly product: string;
}

interface IOrderApi {
  updateQuantity: (orderId: string, priceId: string, quantity: number) => void;
  removeItem: (orderId: string, priceId: string) => void;
  match: match<IMatchParams>;
}

interface Props extends IOrderApi {
  readonly products: ReadonlyArray<ProductForSale>;
  addItem: (orderId: string, priceId: string, quantity: number) => void;
  updateItem: (orderId: string, prevPriceId: string, nextPriceId: string) => void;
  readonly orders: ReadonlyArray<OrderItemContainer>;
  readonly orderByProduct: ReadonlyArray<OrderItemContainer>;
  productsByName: Record<string, ProductForSale>;
  getOrder: (id: string) => void;
}

function orderApi(order: OrderItemContainer, { updateQuantity, removeItem, match }: IOrderApi) {
  const { params: { orderId } } = match;
  return {
    isChecked: (id: string) => order.price.id === id,
    onQuantity: (quantity: number) => updateQuantity(orderId, order.price.id, quantity),
    onRemove: () => removeItem(orderId, order.price.id),
  }
}

function ProductItem({ products, addItem, orderByProduct, productsByName, ...props }: Props) {
  const { match: { params }} = props;

  const addHandler = (priceId: string) => addItem(
    params.orderId,
    priceId,
    1,
  );

  const changeHandler = (order: OrderItemContainer) => (nextPriceId: string) => props.updateItem(
    params.orderId,
    order.price.id,
    nextPriceId,
  );

  const api = (order: OrderItemContainer) => orderApi(order, props);
  
  React.useEffect(() => {
    props.getOrder(props.match.params.orderId);
  }, [props.match.params.orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={styles.container}>
      {
        orderByProduct.map((order) => (
          <Product
            key={order.product.name + order.volume.name}
            onChange={changeHandler(order)}
            title={order.product.title}
            name={order.product.name}
            valuation={productsByName[order.product.name].valuation}
            orderApi={api(order)}
            quantity={order.quantity}
          />
        ))
      }
      {
        products.map((product) => (
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

const mapStateToProps = (state: AppState, props: Props) => ({
  products: productItemSelector(state, props),
  orders: ordersSelector(state, props),
  orderByProduct: orderByProductSelector(state, props),
  productsByName: productItemByNameSelector(state, props),
});

const mapDispatchToProps = {
  getOrder: getOrderAction,
  addItem: addItemAction,
  updateQuantity: updateQuantityAction,
  updateItem: updateItemAction,
  removeItem: removeItemAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem);

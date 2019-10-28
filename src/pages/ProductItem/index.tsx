import * as React from 'react';
import { connect } from 'react-redux';
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
} from 'domain/orders';
import { PropsMatch } from 'domain/routes';
import { AppState } from 'domain/StoreType';
import styles from './product.module.css';

interface IOrderApi {
  updateQuantity: (id: string, priceId: string, quantity: number) => void;
  removeItem: (priceId: string) => void;
}

interface Props extends PropsMatch, IOrderApi {
  readonly products: ReadonlyArray<ProductForSale>;
  addItem: (id: string, priceId: string, quantity: number) => void;
  updateItem: (prevPriceId: string, nextPriceId: string) => void;
  readonly orders: ReadonlyArray<OrderItemContainer>,
  readonly orderByProduct: ReadonlyArray<OrderItemContainer>,
  productsByName: Record<string, ProductForSale>,
}

function orderApi(order: OrderItemContainer, { updateQuantity, removeItem }: IOrderApi) {
  return {
    isChecked: (id: string) => order.price.id === id,
    onQuantity: (quantity: number) => updateQuantity('#fff', order.price.id, quantity),
    onRemove: () => removeItem(order.price.id),
  }
}

function ProductItem({ products, addItem, orderByProduct, productsByName, ...props }: Props) {
  const addHandler = (priceId: string) => addItem('#fff', priceId, 1);
  const changeHandler = (order: OrderItemContainer) => (nextPriceId: string) => props.updateItem(order.price.id, nextPriceId);
  const api = (order: OrderItemContainer) => orderApi(order, props);
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
  orders: ordersSelector(state),
  orderByProduct: orderByProductSelector(state, props),
  productsByName: productItemByNameSelector(state, props)
});

const mapDispatchToProps = {
  addItem: addItemAction,
  updateQuantity: updateQuantityAction,
  updateItem: updateItemAction,
  removeItem: removeItemAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem);

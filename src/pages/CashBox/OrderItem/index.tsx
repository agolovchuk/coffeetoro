import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router-dom';
import { ordersSelector, OrderItemContainer } from 'domain/orders';
import { AppState } from 'domain/StoreType';
import Order from 'components/Order';

interface IOrderParams {
  orderId: string;
}

interface Props {
  orders: ReadonlyArray<OrderItemContainer>;
  match: match<IOrderParams>;
}

function OrderItem({ orders, match }: Props) {
  return (
    <Order
      list={orders}
      onComplete={() => null}
      orderId={match.params.orderId}
    />
  )
}

const mapStateToProps = (state: AppState, props: Props) => ({
  orders: ordersSelector(state, props),
});

export default connect(mapStateToProps, {})(OrderItem);
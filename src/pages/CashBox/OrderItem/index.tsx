import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router-dom';
import {
  ordersSelector,
  OrderItemContainer,
  completeOrderAction,
  PaymentMethod,
} from 'domain/orders';
import { AppState } from 'domain/StoreType';
import Order from 'components/Order';

interface IOrderParams {
  orderId: string;
}

interface Props {
  orders: ReadonlyArray<OrderItemContainer>;
  match: match<IOrderParams>;
  onComplete: (id: string, method: PaymentMethod) => void;
}

function OrderItem({ orders, match, onComplete }: Props) {
  return (
    <Order
      list={orders}
      onComplete={(method) => onComplete(match.params.orderId, method)}
      orderId={match.params.orderId}
    />
  )
}

const mapStateToProps = (state: AppState, props: Props) => ({
  orders: ordersSelector(state, props),
});

const mapDispatchToProps = {
  onComplete: completeOrderAction
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);
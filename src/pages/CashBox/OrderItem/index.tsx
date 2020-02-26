import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { PropsMatch } from 'domain/routes';
import {
  ordersSelector,
  completeOrderAction,
  getOrderAction,
} from 'domain/orders';
import { AppState } from 'domain/StoreType';
import Order from 'components/Order';

interface IOrderParams {
  orderId: string;
}

type PropsFromRouter = PropsMatch<IOrderParams>;

const mapState = (state: AppState, props: PropsFromRouter) => ({
  orders: ordersSelector(state, props),
});

const mapDispatch = {
  onComplete: completeOrderAction,
  getOrder: getOrderAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {};

function OrderItem({ orders, match, onComplete, getOrder }: Props) {
  const { orderId } = match.params
  React.useEffect(() => {
    getOrder(orderId);
  }, [getOrder, orderId]);
  return (
    <Order
      list={orders}
      onComplete={(method) => onComplete(match.params.orderId, method)}
      orderId={match.params.orderId}
    />
  )
}

export default connector(OrderItem);
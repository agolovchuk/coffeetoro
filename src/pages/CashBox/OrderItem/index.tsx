import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  ordersSelector,
  completeOrderAction,
  getOrderAction,
  fastAddAction,
} from 'domain/orders';
import { CRUD } from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import Order from 'components/Order';

interface IOrderParams {
  orderId: string;
}

type PropsFromRouter = RouteComponentProps<IOrderParams>;

const mapState = (state: AppState, props: PropsFromRouter) => ({
  orders: ordersSelector(state, props),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  onComplete: completeOrderAction,
  getOrder: getOrderAction,
  fastAdd: fastAddAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {};

function OrderItem({ orders, match, onComplete, getOrder, getDictionary, fastAdd, history }: Props) {
  const { orderId } = match.params

  React.useEffect(() => { getDictionary('units'); }, [getDictionary]);

  React.useEffect(() => { getOrder(orderId); }, [getOrder, orderId]);

  const handleComplete = React.useCallback((method) => {
    history.replace('/orders');
    onComplete(orderId, method);
  }, [orderId, onComplete, history]);

  const handleFastAdd = React.useCallback((barcode: string, cb: (r: boolean) => void) => {
    if (barcode.length > 0) {
      fastAdd(orderId, barcode).then(cb);
    }
  }, [orderId, fastAdd]);

  return (
    <Order
      list={orders}
      onComplete={handleComplete}
      orderId={orderId}
      onFastAdd={handleFastAdd}
    />
  )
}

export default connector(OrderItem);

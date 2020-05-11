import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { PropsMatch } from 'domain/routes';
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

type PropsFromRouter = PropsMatch<IOrderParams>;

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

function OrderItem({ orders, match, onComplete, getOrder, getDictionary, fastAdd }: Props) {
  const { orderId } = match.params

  React.useEffect(() => { getDictionary('units'); }, [getDictionary]);

  React.useEffect(() => { getOrder(orderId); }, [getOrder, orderId]);

  const handleFastAdd = (barcode: string, cb: (r: boolean) => void) => {
    if (barcode.length > 0) {
      fastAdd(match.params.orderId, barcode).then(cb);
    }
  }

  return (
    <Order
      list={orders}
      onComplete={(method) => onComplete(match.params.orderId, method)}
      orderId={match.params.orderId}
      onFastAdd={handleFastAdd}
    />
  )
}

export default connector(OrderItem);

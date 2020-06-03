import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  ordersSelector,
  completeOrderAction,
  getOrderAction,
  fastAddAction,
  addDiscountAction,
  removeDiscountAction,
  discountsListSelector,
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
  discountsList: discountsListSelector(state),
});

const mapDispatch = {
  getDictionary: CRUD.getAllAction,
  onComplete: completeOrderAction,
  getOrder: getOrderAction,
  fastAdd: fastAddAction,
  addDiscount: addDiscountAction,
  removeDiscount: removeDiscountAction
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux, PropsFromRouter {};

function OrderItem({ orders, match, onComplete, getOrder, getDictionary, fastAdd, removeDiscount, history, ...rest }: Props) {
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

  const handleRemoveDiscount = React.useCallback((discountId: string) => {
    removeDiscount(orderId, discountId)
  }, [removeDiscount, orderId]);

  return (
    <Order
      list={orders}
      onComplete={handleComplete}
      orderId={orderId}
      onFastAdd={handleFastAdd}
      onAddDiscount={rest.addDiscount}
      discounts={rest.discountsList}
      onRemoveDiscount={handleRemoveDiscount}
    />
  );
}

export default connector(OrderItem);

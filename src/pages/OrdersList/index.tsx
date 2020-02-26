import * as React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { ordersListSelector, createOrderAction, getOrdersListAction } from 'domain/orders';
import { AppState } from 'domain/StoreType';

import styles from './orders.module.css';

const mapState = (state: AppState) => ({
  orders: ordersListSelector(state),
});

const mapDispatch = {
  createOrder: createOrderAction,
  getOrdersList: getOrdersListAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {};

function Orders({ orders, createOrder, getOrdersList }: Props) {
  
  React.useEffect(() => { getOrdersList(); }, [getOrdersList]);

  return (
    <React.Fragment>
      <button
        className={cx(styles.btn, styles.create)}
        type="button"
        onClick={() => createOrder()}
      />
      <section className={styles.content}>
        <h2 className={styles.title}>Активные заказы</h2>
        <ul className={styles.list}>
          {
            orders.map((e, i) => (
              <li key={e.id}>
                <Link className={cx(styles.btn, styles.place)} to={`/order/${e.id}`}>
                  <span className={styles.index}>{i + 1}</span>
                </Link>
              </li>
            ))
          }
        </ul>
      </section>
    </React.Fragment>
  )
}

export default connector(Orders);
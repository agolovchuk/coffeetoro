import * as React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { connect } from 'react-redux';
import { ordersListSelector, createOrderAction, Order, getOrdersListAction } from 'domain/orders';
import { AppState } from 'domain/StoreType';

import styles from './orders.module.css';

interface Props {
  orders: ReadonlyArray<Order>;
  createOrder: () => void;
  getOrdersList: () => void;
}

const mapsStateToProps = (state: AppState) => ({
  orders: ordersListSelector(state),
});

const mapDispatchToProps = {
  createOrder: createOrderAction,
  getOrdersList: getOrdersListAction,
}

function Orders({ orders, createOrder, getOrdersList }: Props) {
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { getOrdersList(); }, []);

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

export default connect(mapsStateToProps, mapDispatchToProps)(Orders);
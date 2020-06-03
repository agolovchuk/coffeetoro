import * as React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { ordersListSelector, createOrderAction, getOrdersListAction, removeOrderAction } from 'domain/orders';
import { AppState } from 'domain/StoreType';
import { FormattedMessage as FM } from 'react-intl';

import styles from './orders.module.css';

const mapState = (state: AppState) => ({
  orders: ordersListSelector(state),
});

const mapDispatch = {
  createOrder: createOrderAction,
  getOrdersList: getOrdersListAction,
  removeOrder: removeOrderAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {};

function Orders({ orders, createOrder, getOrdersList, removeOrder }: Props) {

  React.useEffect(() => { getOrdersList(); }, [getOrdersList]);

  const handleRemove = React.useCallback((id) => () => {
    removeOrder(id);
  }, [removeOrder]);

  return (
    <div className={styles.wrapper}>
      <button
        className={cx(styles.btn, styles.create)}
        type="button"
        onClick={() => createOrder()}
      />
      <section className={styles.content}>
        <FM id="activeOrders" defaultMessage="Active Orders">
          { v => <h2 className={styles.title}>{ v }</h2> }
        </FM>
        <ul className={styles.list}>
          {
            orders.map((e, i) => (
              <li key={e.id} className={styles.item}>
                <Link className={cx(styles.btn, styles.place)} to={`/order/${e.id}`}>
                  <span className={styles.index}>{i + 1}</span>
                </Link>
                {
                  e.count || (
                    <button
                      className={styles.remove}
                      type="button"
                      onClick={handleRemove(e.id)}
                    />
                  )
                }
              </li>
            ))
          }
        </ul>
      </section>
    </div>
  )
}

export default connector(Orders);

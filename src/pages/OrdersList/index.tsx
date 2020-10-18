import * as React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { connect, ConnectedProps } from 'react-redux';
import { myOrdersListSelector, createOrderAction, getOrdersListAction, removeOrderAction } from 'domain/orders';
import { AppState } from 'domain/StoreType';
import { FormattedMessage as FM } from 'react-intl';

import styles from './orders.module.css';

const mapState = (state: AppState) => ({
  orders: myOrdersListSelector(state),
});

const mapDispatch = {
  createOrder: createOrderAction,
  getOrdersList: getOrdersListAction,
  removeOrder: removeOrderAction,
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

function Orders({ orders, createOrder, getOrdersList, removeOrder }: Props) {

  const handleRemove = React.useCallback((id) => () => {
    removeOrder(id);
  }, [removeOrder]);

  const handleCreate = React.useCallback(() => {
    createOrder()
  }, [createOrder]);

  React.useEffect(() => { getOrdersList(); }, [getOrdersList]);

  return (
    <div className={styles.wrapper}>
      <button
        className={cx(styles.btn, styles.create)}
        type="button"
        onClick={handleCreate}
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
                  (typeof e.count === 'undefined' || e.count === 0) ? (
                    <button
                      className={styles.remove}
                      type="button"
                      onClick={handleRemove(e.id)}
                    />
                  ) : null
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

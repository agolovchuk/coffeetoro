import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ordersSelector, OrderItemContainer } from 'domain/orders';
import Categories from 'pages/Categories';
import Products from 'pages/Products';
import ProductItem from 'pages/ProductItem';
import Order from 'components/Order';
import Bar from 'components/Bar';
import { AppState } from 'domain/StoreType';
import './sheet.css';

interface Props {
  orders: ReadonlyArray<OrderItemContainer>,
}

function CashBox({ orders }: Props) {
  return (
    <div className="cachebox__container">
      <header className="cachebox__header">
        <Bar />
      </header>
      <main className="cachebox__main">
        <Switch>
          <Route path={['/', '/:type']} exact component={Categories} />
          <Route path="/:type/:category" exact component={Products} />
          <Route path="/:type/:category/:product" exact component={ProductItem} />
        </Switch>
      </main>
      <aside className="cachebox__aside">
        <Order list={orders} onComplete={() => null} />
      </aside>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  orders: ordersSelector(state),
});

export default connect(mapStateToProps, {})(CashBox);
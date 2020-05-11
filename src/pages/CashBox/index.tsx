import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Categories from 'pages/Categories';
import ProductItem from 'pages/ProductItem';
import OrderItem from './OrderItem';
import styles from './cachebox.module.css';

function CacheBox() {
  return (
    <div className={styles.container}>
      <Switch>
        <Route path={['/order/:orderId', '/order/:orderId/:categoryId']} exact component={Categories} />
        <Route path="/order/:orderId/:categoryId/product" exact component={ProductItem} />
      </Switch>
      <Route path="/order/:orderId" component={OrderItem} />
    </div>
  )
}

export default CacheBox;

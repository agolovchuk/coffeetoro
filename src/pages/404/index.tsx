import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './pnf.module.css';

function PageNotFound() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>404</h1>
        <div className={styles.wrapper}>
          <p className={styles.description}>Page not found</p>
          <Link to="/" className={styles.link}>Back to main page</Link>
        </div>
    </section>
  )
}

export default PageNotFound;
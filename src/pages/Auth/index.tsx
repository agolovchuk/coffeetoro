import * as React from 'react';
import styles from './auth.module.css';

function Auth() {
  return (
    <div className={styles.container}>
      <form>
        <div className={styles.fieldWrapper}>
          <input type="text" name="email" className={styles.field} />
        </div>
        <div className={styles.fieldWrapper}>
          <input type="password" name="password" className={styles.field} />
        </div>
        <div className={styles.btnGroup}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}

export default Auth;

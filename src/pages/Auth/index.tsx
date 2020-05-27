import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import cx from 'classnames';
import { AppState } from 'domain/StoreType';
import { getUsersAction, usersListSelector } from 'domain/users';
import { loginAction, userSelector } from 'domain/env';
import { Modal, Popup } from 'components/Popup';
import styles from './auth.module.css';
import { FormattedMessage as FM } from 'react-intl';

const mapState = (state: AppState) => ({
  users: usersListSelector(state),
  currentUser: userSelector(state),
});

const mapDispatch = {
  getUsers: getUsersAction,
  login: loginAction,
}

const connector = connect(mapState, mapDispatch);

interface StateUser {
  id: string;
  name: string;
  password: string;
}

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps {};

function Auth({ getUsers, users, login, currentUser, history }: Props) {

  const passwordInput = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (currentUser !== null) {
      history.replace('/orders');
    } else {
      getUsers();
    }
  }, [getUsers, currentUser, history]);

  const [user, setUser] = React.useState<null | StateUser>(null);

  React.useLayoutEffect(() => {
    if (passwordInput.current) {
      passwordInput.current.focus();
    }
  }, [user]);

  const [error, setError] = React.useState<null | string>(null);

  const onError = (err: any) => {

    if (typeof err === 'string') setError(err);
  };

  const handleLogin = ({ id, password }: StateUser) => {
    login({ id, password, onError });
  }

  return (
    <Modal>
      <Popup onCancel={() => null}>
          <div className={styles.container}>
            <div className={styles.header}>{user ? (
              <div>
                <div className={styles.noava}>{user.name.slice(0, 1)}</div>
                <FM id="helloMessage" defaultMessage="Hello, {user}" values={{ user: user.name }}/>
              </div>
              ) : <FM id="selectUser" defaultMessage="Select user"/>}</div>
            {
              user === null ? (
                <ul className={styles.users}>
                  {
                    users.map(({ id, name }) => (
                      <li key={id} className={styles.item}>
                        <button
                          type="button"
                          className={styles.user}
                          onClick={() => setUser({ id, name, password: '' })}
                        >{name}</button>
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <Form
                  onSubmit={handleLogin}
                  initialValues={user}
                  render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className={styles.form}>
                      <Field name="name" type="hidden" render={({ input, meta }) => (
                        <input className={styles.field} {...input} />
                      )}/>
                      <div className={styles.fieldWrapper}>
                        <Field name="password" type="password" render={({ input, meta }) => (
                          <input ref={passwordInput} className={cx(styles.field, {[styles.fieldError]: error })} {...input} />
                        )}/>
                        <button type="submit" className={styles.btn} />
                        {
                          error && (
                            <div className={styles.error}>{error}</div>
                          )
                        }
                      </div>
                    </form>
                  )}
                />
              )
            }
          </div>
      </Popup>
    </Modal>
  )
}

export default connector(Auth);

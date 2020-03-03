import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { InputField } from 'components/Form/field';
import { userSelector } from 'domain/env';
import { updateUserAction, updatePasswordAction } from 'domain/users';
import { AppState } from 'domain/StoreType';
import styles from './user.module.css';

const mapState = (state: AppState) => ({
  user: userSelector(state),
});

const mapDispatch = {
  updateUser: updateUserAction,
  updatePassword: updatePasswordAction,
}

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector> {};

function UserPage({ user, updateUser, updatePassword }: Props) {

  const updateHandler = React.useCallback((data) => { updateUser(data); }, [updateUser]);

  const handleUpdatePassword = React.useCallback((data) => { updatePassword(data); }, [updatePassword]);

  if (user === null) throw new Error('No user');
  return (
    <section className={styles.conent}>
      <div className={styles.column}>
      <h2 className={styles.title}>Manage your profile</h2>
        <Form
          onSubmit={updateHandler}
          initialValues={user}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Field name="name" render={({ input, meta }) => (
                <InputField id="name" title="Name:" {...input} />
              )}/>
              <Field name="firstName" render={({ input, meta }) => (
                <InputField id="firstName" title="First name:" {...input} />
              )}/>
              <Field name="lastName" render={({ input, meta }) => (
                <InputField id="lastName" title="Last name:" {...input} />
              )}/>
              <div className={styles.btnGroup}>
                <button className={styles.btn} type="submit">Save</button>
              </div>
            </form>
          )}
        />
        
      </div>
      <div className={styles.column}>
        <h2 className={styles.title}>Update password</h2>
        <Form
          onSubmit={handleUpdatePassword}
          initialValues={{ id: user.id }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Field name="id" type="hidden" render={({ input, meta }) => (
                <input {...input} />
              )}/>
              <Field name="old" type="password" render={({ input, meta }) => (
                <InputField id="old" title="Old password:" {...input} />
              )}/>
              <Field name="password" type="password" render={({ input, meta }) => (
                <InputField id="password" title="New password:" {...input} />
              )}/>
              <Field name="confirm" type="password" render={({ input, meta }) => (
                <InputField id="confirm" title="Confirm password:" {...input} />
              )}/>
              <div className={styles.btnGroup}>
                <button className={styles.btn} type="submit">Set Password</button>
              </div>
            </form>
          )}
        />
      </div>
    </section>
  )
}

export default connector(UserPage);
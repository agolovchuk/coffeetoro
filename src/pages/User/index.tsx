import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { FormattedMessage as FM } from 'react-intl';
import { InputField, SelectField, ISelectList } from 'components/Form/field';
import { userSelector } from 'domain/env';
import { updateUserAction, updatePasswordAction } from 'domain/users';
import { AppState } from 'domain/StoreType';
import styles from './user.module.css';

const mapState = (state: AppState) => ({
  user: userSelector(state),
});

const LANGUAGES: ISelectList = [
  { name: 'en', title: 'English' },
  { name: 'ru', title: 'Русский' }
]

const mapDispatch = {
  updateUser: updateUserAction,
  updatePassword: updatePasswordAction,
}

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector> {};

function UserPage({ user, updateUser, updatePassword }: Props) {

  const [btnState, setBtnState] = React.useState(false);

  const passwordForm = React.useRef<HTMLFormElement | null>(null);

  const updateHandler = React.useCallback((data) => { updateUser(data, () => {}); }, [updateUser]);

  const onComplete = (e?: Error) => {
    setBtnState(false);
    if (passwordForm.current) {
      passwordForm.current.reset();
    }
    // TODO: Improve exaption handler
  }

  const handleUpdatePassword = React.useCallback((data) => {
    updatePassword(data, onComplete);
    setBtnState(true);
  }, [updatePassword]);

  if (user === null) throw new Error('No user');
  return (
    <section className={styles.content}>
      <div className={styles.column}>
      <FM id="user.manageYourProfile" defaultMessage="Manage your profile">
        {
          (t: string) => (
            <h2 className={styles.title}>{t}</h2>
          )
        }
      </FM>
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
               <Field name="lang" render={({ input, meta }) => (
                <SelectField list={LANGUAGES} id="lang" title="Language:" {...input} />
              )}/>
              <div className={styles.btnGroup}>
                <button
                  className={styles.btn}
                  disabled={btnState}
                  type="submit"
                >Save</button>
              </div>
            </form>
          )}
        />
        <div className={styles.version}>{require('../../../package.json').version}</div>
      </div>
      <div className={styles.column}>
        <FM id="user.updatePassword" defaultMessage="Update password">
          {
            (t: string) => (
              <h2 className={styles.title}>{t}</h2>
            )
          }
        </FM>
        <Form
          onSubmit={handleUpdatePassword}
          initialValues={{ id: user.id }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.form} ref={passwordForm}>
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
                <button
                  className={styles.btn}
                  disabled={btnState}
                  type="submit"
                >Set Password</button>
              </div>
            </form>
          )}
        />
      </div>
    </section>
  )
}

export default connector(UserPage);

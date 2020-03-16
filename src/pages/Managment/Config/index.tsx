import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FormattedMessage as FM } from 'react-intl';
import { Form, Field } from 'react-final-form';
import cx from 'classnames';
import { InputField, CheckBoxField } from 'components/Form/field';
import { firebaseConfigSelector, FirebaseConfig, updateFirebaseConfigAction } from 'domain/env';
import { AppState } from 'domain/StoreType';
import styles from './config.module.css';

function fbDefault(): FirebaseConfig {
  return {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    storageBucket: '',
  }
}

const mapState = (state: AppState) => ({
  firebaseConfig: firebaseConfigSelector(state),
});

const mapDispatch = {
  updateConfig: updateFirebaseConfigAction,
}

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

function ConfigManagment({ firebaseConfig, updateConfig }: Props) {

  const [fbConfig, setFBConfig] = React.useState(firebaseConfig);

  const resetConfig = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const state = e.target.checked ? firebaseConfig || fbDefault() : null;
    setFBConfig(state);
  }, [firebaseConfig]);

  const handleSubmit = React.useCallback((v: FirebaseConfig | null) => { updateConfig(v); }, [updateConfig]);

  return (
    <section>
      <FM
        id="managment.systemConfig"
        defaultMessage="System Configuration"
      >
      {
        t => <h1 className={styles.title}>{t}</h1>
      }
      </FM>
      <div className="column_wrapper">
        <div className={cx('column_item', styles.content)}>
          <h2 className={styles.subtitle}>Firebase Sync</h2>
          <CheckBoxField
            id="firebase"
            title="Enabe:"
            onChange={resetConfig}
            checked={fbConfig !== null}
          />
          {
            fbConfig ? (
              <Form
              onSubmit={handleSubmit}
              initialValues={fbConfig}
              render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div>
                      <Field name="apiKey" render={({ input, meta }) => (
                        <InputField id="apiKey" title="Api Key:" {...input} />
                      )}/>
                      <Field name="authDomain" render={({ input, meta }) => (
                        <InputField id="authDomain" title="Auth Domain:" {...input} />
                      )}/>
                      <Field name="databaseURL" render={({ input, meta }) => (
                        <InputField id="databaseURL" title="Database URL:" {...input} />
                      )}/>
                      <Field name="storageBucket" render={({ input, meta }) => (
                        <InputField id="storageBucket" title="Storage Bucket:" {...input} />
                      )}/>
                    </div>
                  <div className={styles.btnGroup}>
                    <button
                      type="submit"
                      className={cx('btn', 'btn__posetive', styles.btn)}
                    >Save</button>
                  </div>
                </form>
              )}
            />
            ) : (
              <div className={styles.btnGroup}>
                <button
                  type="submit"
                  className={cx('btn', 'btn__posetive', styles.btn)}
                  onClick={() => handleSubmit(null)}
                >Save</button>
              </div>
            )
          }
        </div>
      </div>
    </section>
  )
}

export default connector(ConfigManagment);
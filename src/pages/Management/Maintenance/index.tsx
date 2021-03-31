import * as React from 'react';
import cx from 'classnames';
import { Confirmation, Modal, Popup } from 'components/Popup';
import { promisifyRequest } from 'lib/idbx/helpers';
import { DB_NAME } from 'db/constants';
import styles from './maintenance.module.css';

const clearDB = async() => {
  try {
    await promisifyRequest(indexedDB.deleteDatabase(DB_NAME));
    window.location.href = '/';
  } catch (err) {
    console.warn("Couldn't delete database");
  }
}

function Maintenance() {

  const [confirmation, setConfirmation] = React.useState(false);

  const setClose = React.useCallback(() => setConfirmation(false), [setConfirmation]);

  const setOpen = React.useCallback(() => setConfirmation(true), [setConfirmation]);

  return (
    <section className="scroll-section">
      <h1 className={styles.title}>Maintenance</h1>
      <div className={cx('grid__container', styles.container)}>
        <div className="grid__item">
          <button
            type="button"
            className="tile__container"
            onClick={setOpen}
          >
            <h2 className="tile__title">Clear Database</h2>
          </button>
        </div>
      </div>
      {
        confirmation ? (
          <Modal>
            <Popup onCancel={setClose}>
              <Confirmation
                title="Clear Database"
                onConfirm={clearDB}
                onCancel={setClose}
              >
                <div className={styles.popupWrapper}>
                  <h2>All Data will be lost</h2>
                </div>
              </Confirmation>
            </Popup>
          </Modal>
        ) : null
      }
    </section>
  )
}

export default React.memo(Maintenance);

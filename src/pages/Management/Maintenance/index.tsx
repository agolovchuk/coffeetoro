import * as React from 'react';
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
  const [confirmation, setConfirmattion] = React.useState(false);
  return (
    <section className="scroll-section">
      <h1 className={styles.title}>Maintenance</h1>
      <div className={styles.content}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setConfirmattion(true)}
        >Clear Database</button>
      </div>
      {
        confirmation ? (
          <Modal>
            <Popup onCancel={() => setConfirmattion(false)}>
            <Confirmation
                title="Clear Database"
                onConfirm={clearDB}
                onCancel={() => setConfirmattion(false)}
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

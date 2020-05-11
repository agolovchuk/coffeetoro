import * as React from 'react';
import { Modal, Popup, Confirmation } from 'components/Popup';
import styles from './confirmation.module.css';

interface Props {
  item: string;
  onRemove: () => void;
  onCancel: () => void;
}

function RemoveConfirmation({ onRemove, onCancel, item }: Props) {
  return (
    <Modal>
      <Popup onCancel={onCancel}>
        <Confirmation
          title="Подтвердите удаление"
          onCancel={onCancel}
          onConfirm={onRemove}
        >
          <div className={styles.message}>
            <p>Вы действительно хотите убрать <b>{item}</b> из заказа</p>
          </div>
        </Confirmation>
      </Popup>
    </Modal>
  );
}

export default RemoveConfirmation;
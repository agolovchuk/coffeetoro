import * as React from 'react';
import { PopupHeader } from 'components/Popup'
import styles from './title.module.css';

interface Props {
  onBack: () => void;
  title: string;
}

export default function Title({ onBack, title }: Props) {
  return (
    <PopupHeader className={styles.title} title={(
      <React.Fragment>
        <button
          type="button"
          onClick={onBack}
          className={styles.back}
        />
        {title}
      </React.Fragment>
    )}/>
  );
}

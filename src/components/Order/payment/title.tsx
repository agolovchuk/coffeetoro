import * as React from 'react';
import styles from './title.module.css';

interface Props {
  onBack: () => void;
  title: string;
}

export default function Title({ onBack, title }: Props) {
  return (
    <h2 className={styles.title}>
      <button
        type="button"
        onClick={onBack}
        className={styles.back}
      />
      {title}
    </h2>
  )
}

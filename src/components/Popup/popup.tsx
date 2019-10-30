import React from 'react';
import cx from 'classnames';
import Close from './close';
import { bodyToggler } from 'lib/domHelpers';
import styles from './popup.module.css';

interface Props {
  children: React.ReactNode,
  onCancel: () => void,
  close?: boolean,
  className?: string,
  closeClassName?: string,
  containerClassName?: string,
}

class Popup extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.body = document.body;
  }

  componentDidMount() {
    bodyToggler(true);
  }

  componentWillUnmount() {
    if (this.body) {
      this.body.removeEventListener('keydown', this.handleKeyDown);
    }
    bodyToggler(false);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      const { onCancel } = this.props;
      if (typeof onCancel === 'function') return onCancel();
    }
  };

  body: HTMLElement;

  render() {
    const { onCancel, close, className, closeClassName, containerClassName } = this.props;
    return (
      <div
        className={cx(styles.container, containerClassName)}
      >
        <Close className={styles.overlay} onCancel={onCancel} />
        <div
          className={cx(styles.popup, className)}
        >
          {
            this.props.children
          }
          {
            close ? (
              <Close
                className={cx(styles.close, closeClassName)}
                onCancel={onCancel}
              />
            ) : null
          }
        </div>
      </div>
    );
  }
}

export default Popup;

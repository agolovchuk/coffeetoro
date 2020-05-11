import { Component } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode;
}

class Modal extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.modalContainer = document.createElement('div');
    this.modalRoot = document.getElementById('modalRoot');
  }

  componentDidMount() {
    if (this.modalRoot) {
      this.modalRoot.appendChild(this.modalContainer);
    }
  }

  componentWillUnmount() {
    if (this.modalRoot) {
      this.modalRoot.removeChild(this.modalContainer);
    }
  }

  modalContainer: HTMLElement;

  modalRoot: HTMLElement | null;

  render() {
    const { children } = this.props;

    return ReactDOM.createPortal(
      children,
      this.modalContainer,
    );
  }
}

export default Modal;

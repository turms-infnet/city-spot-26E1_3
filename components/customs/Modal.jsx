import { Modal as ModalRnp } from 'react-native-paper';

const Modal = ({children, ...props}) => {
  return <ModalRnp {...props}>
        {children}
    </ModalRnp>
};

export default Modal;
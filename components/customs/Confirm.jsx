import { Button, Dialog, Portal, Text } from 'react-native-paper';

const Confirm = ({ visible, hideDialog, title, text, onConfirm, cancelButtonText = "Cancelar", confirmButtonText}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{cancelButtonText}</Button>
          <Button onPress={() => {
            onConfirm();
            hideDialog();
          }}>{confirmButtonText}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Confirm;
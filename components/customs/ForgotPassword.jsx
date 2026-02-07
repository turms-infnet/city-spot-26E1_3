import {
    Button,
    Text,
    TextInput,
    View
} from '@/components/customs';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

const ForgotPassword = ({ forgotPassword, hideModal, showSnackbar }) => {
    const [email, setEmail] = useState('');
    return <View style={styles.container}>
        <Text>Esqueci minha senha</Text>
        <TextInput
            onChangeText={(text) => {
                console.log(text)
                setEmail(text);
            }}
            value={email}
            mode="flat"
            label="E-mail"
            />
            <Button
            onPress={async () => {
                const response = await forgotPassword(email);
                showSnackbar(response);
                hideModal();
            }}
            style={styles.button}
            mode="contained"
            >Enviar link de recuperação</Button>
        </View>
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    borderRadius: 4,
  }
});

export default ForgotPassword;
import { ScrollView, StyleSheet } from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  Button,
  Image,
  Text,
  TextInput,
  View
} from '@/components/customs';
import { useSession } from '@/providers/SessionContext';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput as TIcon } from 'react-native-paper';


export default function RegisterScreen() {
  const { showSnackbar } = useSnackbar() as { showSnackbar: any };
  const { signUp, isLoading } = useSession() as { signUp: any, isLoading: boolean };
  const router = useRouter();
  const [securityState, setSecurityState] = useState(true)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
              <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image
                  style={styles.logo}
                  source={require('@/assets/images/logo.png')} />
                <Text style={styles.title}>Register</Text>
                <Text style={styles.subtitle}>Insira seus dados para se cadastrar</Text>
              </View>
              <View
                  style={styles.form}
              >
                <TextInput 
                  mode="flat"
                  keyboardType="email-address"
                  label="E-mail"
                  value={email}
                  onChangeText={(text: string) => setEmail(text)}
                />
              </View>
              <View>
                <TextInput
                  onChangeText={(text: string) => setPassword(text)}
                  value={password}
                  mode="flat"
                  label="Password"
                  secureTextEntry={securityState}
                  right={<TIcon.Icon icon={securityState ? "eye" : "eye-off"} onPress={() => setSecurityState(!securityState)}/>}
                  />
              </View>
              <View>
                <Button
                  style={styles.button}
                  mode="contained"
                  loading={isLoading}
                  disabled={isLoading}
                  onPress={async () => {
                    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
                    if (!regexEmail.test(email)) {
                      showSnackbar('E-mail inválido');
                    } else if (password.length < 6) {
                      showSnackbar('A senha deve ter no mínimo 6 caracteres');
                    } else if (!regexPassword.test(password)) {
                      showSnackbar('A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial');
                    } else {
                      const message = await signUp(email, password);
                      showSnackbar(message);
                    }
                  }}
                >Cadastrar</Button>
              </View>
              <View>
                <Button
                  disabled={isLoading}
                  onPress={() => {
                    router.push('/login');
                  }}
                style={styles.button}
                >Login</Button>
              </View>
            </View>
            </ScrollView>
          </SafeAreaView>
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    width: "100%",
    paddingHorizontal: 32,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 128,
    height: 128,
    alignSelf: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center"
  },
  subtitle : {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    textAlign: "center"
  },
  form: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 4,
  }
});
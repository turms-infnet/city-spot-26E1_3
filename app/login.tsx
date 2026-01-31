import { ScrollView } from 'react-native';

import {
  Text,
  TextInput,
  View
} from '@/components/customs';
import { TextInput as TIcon } from 'react-native-paper';


export default function LoginScreen() {
  return <ScrollView>
            <View style={{
              paddingHorizontal: 32,
            }}>
              <View>
                <Text>Login</Text>
              </View>
              <View>
                <Text>E-mail</Text>
                <TextInput />
              </View>
              <View>
                <Text>Senha</Text>
                <TextInput
                    label="Password"
                    secureTextEntry
                    right={<TIcon.Icon icon="eye" />}
                  />
              </View>
            </View>
          </ScrollView>
}
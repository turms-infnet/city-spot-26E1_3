import { Appbar, Avatar, Button, FAB, RadioGroup, Text, TextInput, View } from "@/components/customs";
import useImage from "@/hooks/useImage";
import { useSession } from "@/providers/SessionContext";
import { useSnackbar } from "@/providers/SnackbarContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import avatar from "../../assets/images/padrao.png";

export default function TabTwoScreen() {
    const { showSnackbar } = useSnackbar() as { showSnackbar: any };
    const { updateProfile, user, userProfile, isLoading, signOut } = useSession() as { updateProfile: any, user: any, userProfile: any, isLoading: any, signOut: any };
    const router = useRouter();
    const { pickImage, takePhoto, image } = useImage() as { pickImage: any, takePhoto: any, image: any, setImage: any };
    const [profile, setProfile] = useState<any>({
      name: '',
      email: '',
      image: '',
      birthday: undefined,
      sex: 'Não informado'
    });
    const theme = useTheme();
    useEffect(() => {
      if (userProfile !== null && userProfile !== undefined) {  
        setProfile({
          email: userProfile.email,
          name: userProfile.name,
          image: userProfile.image,
          birthday: userProfile.birthday || '',
          sex: userProfile.sex || 'Não informado'
        })
      }
    }, [])

    useEffect(() => {
      if (image) {
        setProfile({ ...profile, image: image })
      }
    }, [image]) 

    const getImage = (image: string) => {
      if (image.indexOf("https") > -1) {
        return image;
      } else {
        return `data:image/png;base64,${image}`
      }
    }

    return  <>
            <Appbar 
              title="Perfil"
              icons={[
                { name: 'cog-outline', onPress: () => router.push('/settings')   },
                { name: 'logout', onPress: () => signOut() },
              ]}
            />
            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={{ marginTop: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={true}
            >
              <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                <View className={"avatar"}>
                  {
                    profile.image ? <Avatar size={200} source={profile.image ? { uri: getImage(profile.image) } : avatar} /> : <Avatar size={200} />
                  }
                  <FAB 
                    onPress={() => {
                      takePhoto([1,1])
                    }}
                    icon="camera"
                    color= "white"
                    style={{
                      ...styles.fab,
                      ...styles.fabLeft,
                      backgroundColor: theme.colors.secondary,
                    }}/>
                  <FAB 
                    onPress={() => {
                      pickImage([1,1]);
                    }}
                    icon="image"
                    color= "white"
                    style={{
                      ...styles.fab,
                      ...styles.fabRight,
                      backgroundColor: theme.colors.secondary,
                    }}/>
                </View>
                <View style={styles.container}>
                    <View
                        style={styles.form}
                    >
                      <TextInput 
                        disabled={true}
                        mode="flat"
                        keyboardType="email-address"
                        label="E-mail"
                        value={profile.email}
                        onChangeText={(text: string) => setProfile({ ...profile, email: text })}
                      />
                    </View>
                    <View
                        style={styles.form}
                    >
                      <TextInput 
                        mode="flat"
                        keyboardType="default"
                        label="Nome"
                        value={profile.name}
                        onChangeText={(text: string) => setProfile({ ...profile, name: text })}
                      />
                    </View>
                    <View
                        style={styles.form}
                    >
                      <Text>Sexo: </Text>
                      <RadioGroup 
                        options={[
                          { label: 'Masculino', value: 'Masculino' },
                          { label: 'Feminino', value: 'Feminino' },
                          { label: 'Não informado', value: 'Não informado' },
                        ]}
                        currentValue={profile.sex}
                        onValueChange={(value: string) => setProfile({ ...profile, sex: value })}
                      />
                    </View>
                    <View
                        style={{
                          ...styles.form,
                          marginTop: 18,
                        }}
                    >
                      <TextInput 
                        mode="flat"
                        label="Data de Nascimento"
                        value={profile.birthday}
                        onChangeText={(text: string) => setProfile({ ...profile, birthday: text })}
                      />
                    </View>
                    <View>
                    <Button
                      loading={isLoading}
                      disabled={isLoading}
                      style={styles.button}
                      mode="contained"
                      onPress={async () => {
                        try {
                          await updateProfile({
                            id: user.id,
                            ...profile
                          });
                          showSnackbar('Perfil atualizado com sucesso!');
                        } catch (error) {
                          console.error(error);
                          showSnackbar(`Erro ao atualizar perfil. Tente novamente mais tarde.`);
                        }
                      }}
                    >Salvar</Button>
                  </View>
                </View>
              </View>
            </ScrollView>

          </>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 32,
    marginTop: 32,
  },
  form: {
    marginBottom: 16,
  },
  button: {
    marginTop: 32,
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    bottom: -15,
    borderRadius: 100,
  },
  fabLeft: {
    left: -15
  },
  fabRight: {
    right: -15,
  }
})
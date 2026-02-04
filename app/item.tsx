import { Appbar, View } from '@/components/customs';
import { useSession } from '@/providers/SessionContext';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import {
    SafeAreaView,
} from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { signOut } = useSession() as { signOut: any };
    const router = useRouter();

  return  <>
            <Appbar 
                onBack={() => {
                    router.back();
                }}
                title=""
                icons={[
                    { name: 'cog-outline', onPress: () => router.push('/settings')   },
                    { name: 'logout', onPress: () => signOut() },
                ]}
            />
            <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}></View>
                </ScrollView>
            </SafeAreaView>
    </>
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


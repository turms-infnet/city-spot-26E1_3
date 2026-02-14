import { Appbar, Button, FAB, Image, TextInput, View } from '@/components/customs';
import useLocations from '@/hooks/useLocations';
import { useSession } from '@/providers/SessionContext';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
	const { loading } = useLocations() as { loading: boolean };
	const { showSnackbar } = useSnackbar() as { showSnackbar: any };
    const { signOut } = useSession() as { signOut: any };
    const { id, location } = useLocalSearchParams() as { id: string, location: string };
    const router = useRouter();

	const [_id, set_Id] = useState(0);
	const [address, setAddress] = useState("");
	const [id_user, setId_user] = useState(null);
	const [image, setImage] = useState("");
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [name, setName] = useState("");
	const [id_server, setId_server] = useState("");
	const [sync, setSync] = useState("");

	const loadData = () => {
		if (id) {
			const data = JSON.parse(location)
			setAddress(data.address);
			setId_user(data.id_user);
			setImage(data.image);
			setLatitude(data.latitude);
			setLongitude(data.longitude);
			setName(data.name);
			set_Id(parseInt(id));
			setId_server(data.id_server);
			setSync(data.sync);
		}
	}

	useEffect(() => {
		loadData()
	}, [])

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
				<View style={styles.safeArea}>
					<ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
					<View style={styles.container}>
						<View>
							<Image
								style={styles.image}
								resize="cover"
								source={{uri: image}} />
								<FAB 
									onPress={() => {
										alert("Left")
									}}
									icon="camera"
										style={{
										...styles.fab,
										...styles.fabLeft,
									}}/>
								<FAB 
									onPress={() => {
										alert("Right")
									}}
									icon="image"
									style={{
										...styles.fab,
										...styles.fabRight,
									}}/>
						</View>
						<View
							style={{
								...styles.form,
								marginTop: 40
							}}
						>
							<TextInput
								mode="flat"
								keyboardType="email-address"
								label="Nome do local"
								value={name}
								onChangeText={(text: string) => setName(text)}
								/>
						</View>
						<View
							style={styles.form}
						>
							<TextInput
								mode="flat"
								label="Endereço"
								value={address}
								onChangeText={(text: string) => setAddress(text)}
								/>
						</View>
						<View
							style={styles.form}
						>
                			<Button
								loading={loading}
								disabled={loading}
								style={styles.button}
								mode="contained"
								onPress={async () => {
									showSnackbar("");
								}}
								>{_id === 0 ? "Cadastrar" : "Editar"}</Button>
							</View>
					</View>
				</ScrollView>
			</View>
		</>
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
	paddingTop: 0
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
	paddingTop: 0
  },
  scrollContainer: {
    flexGrow: 1,
	paddingTop: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
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
    paddingHorizontal: 32,
    marginTop: 16,
  },
  button: {
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    bottom: -43,
  },
  fabRight: {
    right: 0,
  },
  fabLeft: {
	left: 0
  }
});


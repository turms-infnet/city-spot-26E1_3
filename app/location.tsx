import { Appbar, Button, FAB, FreeMap, Image, TextInput, View } from '@/components/customs';
import useGPS from '@/hooks/useGps';
import useImage from '@/hooks/useImage';
import useLocations from '@/hooks/useLocations';
import { useSession } from '@/providers/SessionContext';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HomeScreen() {
	const { coords, address: addressCoord, loading: loadingPosition, errorMsg, getAddress, getPosition } = useGPS() as { coords: any, address: any, loading: any, errorMsg: any, getAddress: any, getPosition: any} 
	const { pickImage, takePhoto, image, setImage } = useImage() as { pickImage: any, takePhoto: any, image: any, setImage: any };
	const { loading } = useLocations() as { loading: boolean };
	const { saveLocation, _updateLocation } = useLocations() as { saveLocation: any, _updateLocation: any };
	const { showSnackbar } = useSnackbar() as { showSnackbar: any };
    const { signOut } = useSession() as { signOut: any };
    const { id, location } = useLocalSearchParams() as { id: string, location: string };
	const theme = useTheme();
    const router = useRouter();

	const [_id, set_Id] = useState(0);
	const [address, setAddress] = useState("");
	const [id_user, setId_user] = useState(null);

	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [name, setName] = useState("");
	const [id_server, setId_server] = useState("");

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
		} 
	}

	useEffect(() => {
		loadData()
		setInterval(() => {
			getPosition()
		}, 60000)
	}, [])

	useEffect(() => {
		if (!id && coords && coords.latitude && coords.longitude) {
			setLatitude(coords.latitude);
			setLongitude(coords.longitude);
			
			if (addressCoord) {
				getAddress(coords.latitude, coords.longitude)
			}
		}

		if (errorMsg){
			showSnackbar(errorMsg)
		}
	}, [coords])

	useEffect(() => {
		setAddress(addressCoord)
	}, [addressCoord])

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
					<View style={styles.container}>
						<View>
							<Image
								style={styles.image}
								resize="cover"
								source={{uri: image ? `data:image/png;base64,${image}` : "https://t4.ftcdn.net/jpg/16/79/44/21/360_F_1679442196_OEsi0AFKie6hYMBpvmXwwRgRYGV4U6Lz.jpg"}} 
								/>
								<FAB 
									disabled={loadingPosition}
									onPress={() => {
										takePhoto()
									}}
									icon="camera"
										style={{
										...styles.fab,
										...styles.fabLeft,
									}}/>
								<FAB 
									disabled={loadingPosition}
									onPress={() => {
										pickImage();
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
								disabled={loadingPosition}
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
								disabled={loadingPosition}
								mode="flat"
								label="Endereço"
								value={address}
								onChangeText={(text: string) => setAddress(text)}
								/>
						</View>
						<View
							style={{
								...styles.form,
								height: 200
							}}
						>
							{
								latitude !== null && longitude !== null ? <FreeMap style={{
									height: 200
								}} latitude={latitude} longitude={longitude}/> : null
							}
						</View>
						<View
							style={styles.form}
						>
                			<Button
								loading={loading || loadingPosition}
								disabled={loading || loadingPosition}
								style={styles.button}
								mode="contained"
								onPress={async () => {
									if (_id === 0 ) {
										await saveLocation({
											id_user, 
											name, 
											address, 
											image, 
											latitude,  
											longitude
										})
										showSnackbar("Local salvo com sucesso.");
									} else {
										await _updateLocation({
											id: _id,
											id_server,
											id_user, 
											name, 
											address, 
											image, 
											latitude,  
											longitude
										})
										showSnackbar("Local atualizado com sucesso.");
									}
								}}
								>{_id === 0 ? "Cadastrar" : "Editar"}</Button>
						</View>
					</View>
			</View>
			{
				_id !== 0 || errorMsg ? <FAB
					icon="map"
					color= "white"
					style={{
					...styles.fab,
					backgroundColor: theme.colors.secondary,
					}}
					onPress={() => { 
						if (!id && coords && coords.latitude && coords.longitude) {
							setLatitude(coords.latitude);
							setLongitude(coords.longitude);
						}
					}}
				/> : null
			}
		</>
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
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


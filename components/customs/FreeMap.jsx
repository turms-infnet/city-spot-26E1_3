import { StyleSheet } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import RnpView from "./View";

const FreeMap = ({latitude, longitude, style: _style}) => {
    return  <RnpView style={style.container}>
                <MapView style={{
                    ...style.map,
                    ..._style
                }}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.09,
                        longitudeDelta: 0.04
                    }}
                    >
                        <UrlTile 
                            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maximumZ={19}
                            flipY={false}
                        />
                        <Marker 
                            coordinate={{ latitude, longitude }}
                        />
                    </MapView>
                {/* {
                    Platform.OS === 'ios' ? <AppleMaps.View
                                                cameraPosition={{
                                                    coordinates: {
                                                        latitude: latitude,
                                                        longitude: longitude,
                                                    },
                                                    zoom: 14,
                                                }}
                                                style={{ flex: 1 }}>
                                                <AppleMaps.Marker
                                                    coordinates={{
                                                        latitude: latitude,
                                                        longitude: longitude,
                                                    }}
                                                    title="Localização Atual"
                                                    description="Você está aqui"
                                                />        
                                            </AppleMaps.View>
                                            : <MapView style={{
                                                                ...style.map,
                                                                ..._style
                                                            }}
                                                                initialRegion={{
                                                                    latitude: latitude,
                                                                    longitude: longitude,
                                                                    latitudeDelta: 0.09,
                                                                    longitudeDelta: 0.04
                                                                }}
                                                                >
                                                                    <UrlTile 
                                                                        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                        maximumZ={19}
                                                                        flipY={false}
                                                                    />
                                                                    <Marker 
                                                                        coordinate={{ latitude, longitude }}
                                                                    />
                                                                </MapView>
                }
                 */}
            </RnpView>
}

const style = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: 200}
})

export default FreeMap;
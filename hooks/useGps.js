
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

const useGPS = () => {
    const [coords, setCoords] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(null)

    const getPosition = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg("Permissão de localização negada.")
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            })

            const { latitude, longitude, altitude, accuracy, altitudeAccuracy } = location.coords;
            setCoords({ latitude, longitude, altitude, accuracy, altitudeAccuracy, latitudeDelta: 0.005, longitudeDelta: 0.005 })
            getAddress(latitude, longitude);
        } catch (error) {
            setErrorMsg("Erro ao obter sua localização: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [])

    const getAddress = async (latitude, longitude) => {
        setErrorMsg(null);
        try {
            const response = await Location.reverseGeocodeAsync({
                latitude, longitude
            });


            if (response.length > 0) {
                const item = response[0];
                setAddress(`${item.street}, ${item.district}, ${item.region}, CEP: ${item.postalCode}, ${item.country}`)
            }
        } catch (error) {
            setErrorMsg("Erro ao obter seu endereço: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPosition();
    }, [getPosition])

    return {
        coords, errorMsg, loading, getPosition, address, getAddress
    }
}


export default useGPS;
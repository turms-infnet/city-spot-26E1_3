import { useSnackbar } from '@/providers/SnackbarContext';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

const useImage = () => {
    const { showSnackbar } = useSnackbar();
    const [image, setImage] = useState(null);

    const requestPermissions = async () => {
        const galeryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStauts = await ImagePicker.requestCameraPermissionsAsync();

        if (galeryStatus.status !== 'granted' || cameraStauts.status !== 'granted') {
            showSnackbar("Você precisa autorizar sua câmera");
            return false;
        }
        return true;
    }

    const pickImage = async () => {
        const { status } = ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            showSnackbar("Permissão de galeria necessária.");
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
            base64: true
        })

        if (!result.canceled) {
            setImage(generateBase64(result.assets[0]))
            return result.assets[0].uri
        }
    }

    const takePhoto = async () => {
        const { status } = ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            showSnackbar("Permissão de galeria necessária.");
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
            base64: true
        })

        if (!result.canceled) {
            setImage(generateBase64(result.assets[0]))
            return result.assets[0].uri
        }
    }

    const generateBase64 = (image) => {
        return `data:image/png;base64,${image.base64}`
    }

    return {
        image, setImage, pickImage, takePhoto, requestPermissions
    }
}

export default useImage;
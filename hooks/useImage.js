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

    const pickImage = async (aspect = [16, 9]) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: aspect,
            quality: 1,
            base64: true
        })

        if (!result.canceled) {
            setImage(result.assets[0].base64)
            return result.assets[0].uri
        }
    }

    const takePhoto = async (aspect = [16, 9]) => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: aspect,
            quality: 1,
            base64: true
        })

        if (!result.canceled) {
            setImage(result.assets[0].base64)
            return result.assets[0].uri
        }
    }

    return {
        image, setImage, pickImage, takePhoto, requestPermissions
    }
}

export default useImage;
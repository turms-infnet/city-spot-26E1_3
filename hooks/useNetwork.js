import * as Network from 'expo-network';
import { useEffect, useState } from "react";

const useNetwork = () => {
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: true,
        isInternetReachable: true,
        type: 'unknown',
    });

    useEffect(() => {
        const check = async () => {
            const state = await Network.getNetworkStateAsync();
            setConnectionStatus((prevStatus) => ({
                ...prevStatus,
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type
            }));
        }

        check();
    }, []);


    return {
        connectionStatus
    }
}

export default useNetwork;
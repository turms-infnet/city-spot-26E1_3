import useNetwork from '@/hooks/useNetwork';
import Database from "@/services/Database";
import { getLocations, insertLocation, updateSyncAndIdServer, updateSyncLocation } from "@/services/SQLite";
import { useCallback, useState } from "react";

const useLocations = () => {
    const { connectionStatus } = useNetwork();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState(null);

    const listLocations = useCallback(async () => {
        setLoading(true);

        const loc = await getLocations(1000, 1, null);
        setLocations(loc);

        setLoading(false);
    }, [page, limit, search]);

    const syncLocation = useCallback(async () => {
        try {
            let data;
            if (search) {
                data = await Database.getData("locations", 1, 1000);
            } else {
                data = await Database.getData("locations", 1, 1000);
            }
            if (data && data.data && data.data.length > 0) {
                await saveDataLocal(data.data)
            }
        } catch (error) {
            console.log(error);
        }
        listLocations();
    }, []);

    const saveLocation = useCallback(async (data) => {
        let sync = 0;
        let id_server = data?.id;

        const _location = await insertLocation(id_server, data.id_user, data.name, data.address, data.image, data.latitude, data.longitude, sync);
        if (connectionStatus.isConnected) {
            if (id_server) {
                Database.saveOrUpdate("locations", { ...data, id: id_server });
                await updateSyncLocation(id_server, 1);
            } else {
                const data = Database.saveOrUpdate("locations", data);
                await updateSyncAndIdServer(_location.id, data.id, 1);
            }
        }
    }, []);

    const saveDataLocal = async (data) => {
        for await (const location of data) {
            await insertLocation(location.id, location.id_user, location.name, location.address, location.image, location.latitude, location.longitude, 1);
        }
    }

    return {
        locations,
        loading,
        listLocations,
        setPage,
        setLimit,
        setSearch,
        syncLocation,
        saveLocation
    }
}

export default useLocations;
import useNetwork from '@/hooks/useNetwork';
import Auth from '@/services/Auth';
import Database from "@/services/Database";
import { saveImageInStorage } from "@/services/Image";
import { deleteLocation, deleteLocationTrash, deleteLocationTrashIdIn, getLocation, getLocations, getLocationsTrash, inserLocationTrash, insertLocation, updateLocation, updateSyncAndIdServer, updateSyncLocation } from "@/services/SQLite";
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
    }, []);

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
                await deleteOnline()
            }
        } catch (error) {
            console.log(error);
        }
        listLocations();
    }, []);

    const _updateLocation = useCallback(async (data) => {
        let sync = 0;
        let id = data?.id;
        let id_server = data?.id_server;

        await updateLocation(id_server, data.id_user, data.name, data.address, data.image, data.latitude, data.longitude, sync, id);
        const _location = await getLocation(id);
        if (connectionStatus.isConnected) {
            data.image = await saveImageInStorage(data.image);
            if (id_server) {
                const d = { ...data, id: id_server };
                delete d["id_server"];
                Database.saveOrUpdate("locations", d);
                await updateSyncLocation(id_server, 1);
            } else {
                const data = Database.saveOrUpdate("locations", data);
                await updateSyncAndIdServer(_location.id, data.id, 1);
            }
        }
        await listLocations();
    }, [])

    const saveLocation = useCallback(async (data) => {
        let sync = 0;
        let id_server = null;

        const user = await Auth.getUser();
        data.id_user = user.id;

        const _location = await insertLocation(id_server, data.id_user, data.name, data.address, data.image, data.latitude, data.longitude, sync);
        if (connectionStatus.isConnected) {
            data.image = await saveImageInStorage(data.image);

            const result = Database.saveOrUpdate("locations", data);
            await updateSyncAndIdServer(_location.id, result.id, 1);
        }
        await listLocations();
    }, []);

    const syncLocationAfterNetwork = useCallback(async () => {
        if (connectionStatus.isConnected) {
            const locationsSqlite = await getLocations(1000, 1, 0)

            for await (const locationSqlite of locationsSqlite) {
                if (locationSqlite.id_server) {
                    Database.saveOrUpdate("locations", { ...locationSqlite, id: locationSqlite.id_server });
                    await updateSyncLocation(locationSqlite.id_server, 1);
                } else {
                    const supabase = Database.saveOrUpdate("locations", locationSqlite);
                    await updateSyncAndIdServer(locationSqlite.id, supabase.id, 1);
                }
            }
        }
    }, [connectionStatus.isConnected]);

    const saveDataLocal = async (data) => {
        for await (const location of data) {
            await insertLocation(location.id, location.id_user, location.name, location.address, location.image, location.latitude, location.longitude, 1);
        }
    }

    const deleteOnline = async () => {
        // TODO: Resolver proxima aula
        const locationsTrash = await getLocationsTrash();
        console.log("Ids trash: ", locationsTrash)
        if (locationsTrash.length > 0 && connectionStatus.isConnected) {
            const listaIds = locationsTrash.map(item => item.id_server);
            await Database.deleteIdIn("locations", listaIds);
            await deleteLocationTrashIdIn(listaIds);
        }
    }

    const _deleteLocation = useCallback(async (id, id_server) => {
        try {
            await deleteLocation(id_server);
            await inserLocationTrash(id, id_server)

            if (connectionStatus.isConnected) {
                try {
                    await Database.deleteData("locations", id_server);
                    await deleteLocationTrash(id_server);
                } catch (err) {
                    console.error(err);
                }
            }
            await listLocations();
        } catch (err) {
            console.log(err)
        }
    }, []);


    return {
        locations,
        loading,
        listLocations,
        _deleteLocation,
        setPage,
        setLimit,
        setSearch,
        syncLocation,
        saveLocation,
        _updateLocation,
        syncLocationAfterNetwork
    }
}

export default useLocations;
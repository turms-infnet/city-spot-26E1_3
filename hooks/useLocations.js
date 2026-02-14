import Database from "@/services/Database";
import { useCallback, useState } from "react";


const useLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState(null);

    const listLocations = useCallback(async () => {
        setLoading(true);



        setLoading(false);
    }, [page, limit, search]);

    const syncLocation = useCallback(async () => {
        // TODO: Pegar locais por id_user
        let data;
        if (search) {
            data = await Database.getData("locations");
        } else {
            data = await Database.getData("locations");
        }

        listLocations();
    },);

    return {
        locations,
        loading,
        listLocations,
        setPage,
        setLimit,
        setSearch,
        syncLocation
    }
}

export default useLocations;
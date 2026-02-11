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
        let data;

        // TODO: Pegar locais por id_user
        if (search) {
            data = await Database.getData("locations", 1, limit, search);
        } else {
            data = await Database.getData("locations", page, limit);
        }

        if (page === 1) {
            setLocations(data?.data || []);
        } else {
            setLocations(prev => [...prev, ...(data?.data || [])]);
        }
        setLoading(false);
    }, [page, limit, search]);

    return {
        locations,
        loading,
        listLocations,
        setPage,
        setLimit,
        setSearch
    }
}

export default useLocations;
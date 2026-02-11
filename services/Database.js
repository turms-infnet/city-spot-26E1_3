import { supabase } from "@/services/Supabase";

const Database = {
    getData: async (tableName, page, limit, search = null) => {
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        return await supabase.from(tableName).select().range(start, end);
    }
}

export default Database;
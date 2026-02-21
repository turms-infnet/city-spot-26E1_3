import Auth from "@/services/Auth";
import { supabase } from "@/services/Supabase";

const Database = {
    getData: async (tableName, page, limit, search = null) => {
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        const user = await Auth.getUser();
        return await supabase.from(tableName).select().range(start, end).eq('id_user', user.id)
    },
    saveOrUpdate: async (tableName, data) => {
        const user = await Auth.getUser();
        return await supabase.from(tableName).upsert({ ...data, id_user: user.id });
    },
}

export default Database;
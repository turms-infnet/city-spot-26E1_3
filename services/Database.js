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
    deleteData: async (tableName, id) => {
        await supabase.from(tableName).delete().eq('id', id)
    },
    deleteIdIn: async (tableName, listadeIds) => {
        console.log(listadeIds)
        await supabase.from(tableName).delete().in('id', listadeIds)
    }
}

export default Database;
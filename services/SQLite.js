import * as SQLite from 'expo-sqlite';

export const initializeDb = async () => {
    const db = await SQLite.openDatabaseAsync("location.db")
    try {
        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                id_user TEXT NOT NULL,
                name TEXT NOT NULL,
                longitude REAL NULL,
                latitude REAL NULL,
                image TEXT NULL,
                address TEXT NULL,
                id_server INTEGER UNIQUE NULL,
                sync INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS locations_trash (
                id INTEGER PRIMARY KEY,
                id_server INTEGER UNIQUE NULL
            );
        `);
        console.log("Tabela locations pronta para o combate!");
    } catch (err) {
        console.error("[[Service:SQLite >> initializeDb]] >> Erro na inicialização do banco", err);
    }
}

export const deleteAllDatas = async () => {
    const db = await SQLite.openDatabaseAsync("location.db")
    try {
        await db.runAsync(`DELETE from locations WHERE id > 0;`);
        await db.runAsync(`DELETE from locations_trash WHERE id > 0;`);
        await db.runAsync(`DELETE FROM sqlite_sequence WHERE name='locations'`);
        console.log("Dados deletados com sucesso!");
    } catch (err) {
        console.error("[[Service:SQLite >> deleteAllDatas]] >> Erro na remoção do banco", err);
    }
}

export const insertLocation = async (id_server, id_user, name, address, image, latitude, longitude, sync) => {
    try {
        const db = await SQLite.openDatabaseAsync("location.db")
        if (id_server == null) {
            return await db.runAsync(`INSERT INTO locations (id_server, id_user, name, address, image, latitude, longitude, sync) VALUES (?,?,?,?,?,?,?,?)`, [id_server, id_user, name, address, image, latitude, longitude, sync]);
        }

        const locationTrash = await getLocationTrash(id_server)
        if (locationTrash) {
            return;
        }
        
        const location = await getLocation(id_server);
        if (location) {
            await updateLocation(id_server, id_user, name, address, image, latitude, longitude, sync);
            return location;
        } else {
            return await db.runAsync(
                `INSERT INTO locations (id_server, id_user, name, address, image, latitude, longitude, sync) VALUES (?,?,?,?,?,?,?,?)`,
                [id_server, id_user, name, address, image, latitude, longitude, sync]
            );
        }
    } catch (err) {
        console.error("[[Service:SQLite >> insertLocation]] >> Erro ao inserir local", err);
    }
}

export const inserLocationTrash = async (id, id_server) => {
    try {
        const db = await SQLite.openDatabaseAsync("location.db")
        return await db.runAsync(`INSERT INTO locations_trash (id, id_server) VALUES (?,?)`, [id, id_server]);
    } catch (err) {
        console.error("[[Service:SQLite >> insertLocation]] >> Erro ao inserir local", err);
    }
}


export const updateSyncLocation = async (id_server, sync) => {
    try {
        const db = await SQLite.openDatabaseAsync("location.db")
        return await db.runAsync(`UPDATE locations SET sync = ? WHERE id_server = ?`, [sync, id_server]);
    } catch (err) {
        console.error("[[Service:SQLite >> updateSyncLocation]] >> Erro ao atualizar sync do local", err);
    }
}

export const updateSyncAndIdServer = async (id, id_server, sync) => {
    try {
        const db = await SQLite.openDatabaseAsync("location.db")

        console.log("Id: ", id)
        console.log("Id server", id_server)
        return await db.runAsync(`UPDATE locations SET id_server = ?, sync = ? WHERE id = ?`, [id_server, sync, id]);
    } catch (err) {
        console.error("[[Service:SQLite >> updateSyncAndIdServer]] >> Erro ao atualizar sync do local", err);
    }
}

export const getLocation = async (id) => {
    const db = await SQLite.openDatabaseAsync("location.db")

    const result = await db.getFirstAsync(`
        SELECT * FROM locations WHERE id = ? LIMIT 1
    `, [id]);
    return result;
}

export const getLocationTrash = async (id_server) => {
    const db = await SQLite.openDatabaseAsync("location.db")

    const result = await db.getFirstAsync(`
        SELECT * FROM locations_trash WHERE id_server = ? LIMIT 1
    `, [id_server]);
    return result;
}

export const getLocations = async (size, page, sync = null) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    const offset = (page - 1) * size;

    if (sync) {
        return await db.getAllAsync(`
            SELECT * FROM locations WHERE sync = ? ORDER BY name ASC LIMIT ? OFFSET ?
        `, [sync, size, offset]);
    } else {
        return await db.getAllAsync(`
            SELECT * FROM locations ORDER BY name ASC LIMIT ? OFFSET ?
        `, [size, offset]);
    }
}

export const getLocationsTrash = async () => {
    const db = await SQLite.openDatabaseAsync("location.db")
    return await db.getAllAsync(`
            SELECT id_server FROM locations_trash
        `);
}

export const updateLocation = async (id_server, id_user, name, address, image, latitude, longitude, sync, id = null) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    if (id) {
        return await db.runAsync(`UPDATE locations 
                SET 
                    id_server = ?,
                    id_user = ?,
                    name = ?,
                    address = ?,
                    image = ?,
                    latitude = ?,
                    longitude = ?,
                    sync = ? 
                WHERE id = ?
                `, [id_server, id_user, name, address, image, latitude, longitude, sync, id]);
    } else {
        return await db.runAsync(`UPDATE locations 
                SET 
                    id_user = ?,
                    name = ?,
                    address = ?,
                    image = ?,
                    latitude = ?,
                    longitude = ?,
                    sync = ? 
                WHERE id_server = ?
                `, [id_user, name, address, image, latitude, longitude, sync, id_server]);
    }
}

export const deleteLocation = async (id_server) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    return db.runAsync(`
        DELETE FROM locations where id_server = ?    
    `, [id_server])
}

export const deleteLocationTrash = async (id_server) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    return db.runAsync(`
        DELETE FROM locations_trash where id_server = ?    
    `, [id_server])
}


export const deleteLocationTrashIdIn = async (id_server_list) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    for (let id of id_server_list) {
        db.runSync(`
            DELETE FROM locations_trash where id_server = (?)    
        `, [id])
    }
}

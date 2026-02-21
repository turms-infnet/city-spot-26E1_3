import * as SQLite from 'expo-sqlite';

export const initializeDb = async () => {
    const db = await SQLite.openDatabaseAsync("location.db")
    try {
        await db.execSync(`
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
        `);
        console.log("Tabela locations pronta para o combate!");
    } catch (err) {
        console.error("[[Service:SQLite >> initializeDb]] >> Erro na inicialização do banco", err);
    }
}

export const deleteAllDatas = async () => {
    const db = await SQLite.openDatabaseAsync("location.db")
    try {
        await db.execAsync(`DELETE from locations WHERE id > 0;`);
        console.log("Dados deletados com sucesso!");
    } catch (err) {
        console.error("[[Service:SQLite >> deleteAllDatas]] >> Erro na remoção do banco", err);
    }
}

export const insertLocation = async (id_server, id_user, name, address, image, latitude, longitude, sync) => {
    try {
        const db = await SQLite.openDatabaseAsync("location.db")

        const location = await getLocation(id_server);
        if (location) {
            updateLocation(id_server, id_user, name, address, image, latitude, longitude, sync);
            console.log("Atualizando local", location)
            return location;
        }
        console.log("Inserindo local", id_server)
        return await db.runAsync(`INSERT INTO locations (id_server, id_user, name, address, image, latitude, longitude, sync) VALUES (?,?,?,?,?,?,?,?)`, [id_server, id_user, name, address, image, latitude, longitude, sync]);
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
        return await db.runAsync(`UPDATE locations SET id_server = ?, sync = ? WHERE id = ?`, [id_server, sync, id]);
    } catch (err) {
        console.error("[[Service:SQLite >> updateSyncAndIdServer]] >> Erro ao atualizar sync do local", err);
    }
} 

export const getLocation = async (id) => {
    const db = await SQLite.openDatabaseAsync("location.db")

    const result = await db.getFirstAsync(`
        SELECT * FROM locations WHERE id_server = ? LIMIT 1
    `, [id]);
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

export const updateLocation = async (id_server, id_user, name, address, image, latitude, longitude, sync) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    return await db.runSync(`UPDATE locations 
                SET 
                    id_server = ?,
                    id_user = ?,
                    name = ?,
                    address = ?,
                    image = ?,
                    latitude = ?,
                    longitude = ?,
                    sync = ? 
                WHERE id_server = ?
                `, [id_server, id_user, name, address, image, latitude, longitude, sync, id_server]);
}

export const deleteLocation = async (id) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    return db.runSync(`
        DELETE FROM locations where id = ?    
    `, [id])
}
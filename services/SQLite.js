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
                longitude REAL,
                latitude REAL,
                image TEXT,
                address TEXT,
                id_server INTEGER UNIQUE NULL,
                sync INTEGER NOT NULL DEFAULT 0
            );
        `);
        console.log("Tabela locations pronta para o combate!");
    } catch (err) {
        console.error("[[Service:SQLite >> initializeDb]] >> Erro na inicialização do banco", err);
    }
}

export const dropDb = async () => {
    const db = await SQLite.openDatabaseAsync("location.db")
    try {
        await db.execSync(`
            DROP TABLE IF EXISTS locations;
        `);
    } catch (err) {
        console.error("[[Service:SQLite >> dropDb]] >> Erro na remoção do banco", err);
    }
}

export const insertLocation = async (id_server, id_user, name, address, image, latitude, longitude, sync) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    return await db.runSync(`INSERT INTO locations (id_server, id_user, name, address, image, latitude, longitude, sync) VALUES (?,?,?,?,?,?,?,?)`, [id_server, id_user, name, address, image, latitude, longitude, sync]);
}

export const getLocations = async (id_user, size, page, sync = null) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    const offset = page * size;

    if (sync) {
        return await db.getAllSync(`
            SELECT * FROM locations WHERE id_user = ? AND sync = ? ORDER BY name ASC LIMIT ? OFFSET ?    
        `, [id_user, sync, size, offset]);
    } else {
        return await db.getAllSync(`
            SELECT * FROM locations WHERE id_user = ? ORDER BY name ASC LIMIT ? OFFSET ?    
        `, [id_user, size, offset]);
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
                `, [id_server, id_user, name, address, image, latitude, longitude, sync]);
}

export const deleteLocation = async (id) => {
    const db = await SQLite.openDatabaseAsync("location.db")
    return db.runSync(`
        DELETE FROM locations where id = ?    
    `, [id])
}
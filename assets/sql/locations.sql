CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    id_server INTEGER UNIQUE NULL,
    created_at TEXT NOT NULL DEFAULT (datetime ('now')),
    id_user TEXT NULL,
    name TEXT NOT NULL,
    address TEXT NULL,
    latitude REAL NULL,
    longitude REAL NULL,
    image TEXT NULL,
    sync INTEGER NOT NULL DEFAULT 0
);
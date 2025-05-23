import { openDB, IDBPDatabase } from 'idb'

const DB_NAME = 'vue-char-translate'
const STORE_NAME = 'default'
const DB_VERSION = 1

export async function saveImage(png: Uint8Array) {
    const db = await getImageDB()
    await db.put(STORE_NAME, png, 'image')
}

export async function loadImage(): Promise<Uint8Array | null> {
    const db = await getImageDB()
    return await db.get(STORE_NAME, 'image')
}

async function getImageDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }
    })
}

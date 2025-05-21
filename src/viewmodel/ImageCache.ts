export async function saveImage(png: Uint8Array) {
    const db = await getImageDB()
    const tx = db.transaction("default", "readwrite")
    tx.objectStore("default").put(png, "image")
    tx.commit?.()
}

export async function loadImage(): Promise<Uint8Array> {
    const db = await getImageDB()
    const tx = db.transaction("default", "readonly")
    const req = tx.objectStore("default").get("image")
    return new Promise((resolve, reject) => {
        req.onsuccess = () => {
            if (req.result) {
                resolve(req.result)
            } else {
                resolve(null)
            }
        }
        req.onerror = () => reject(req.error)
    })
}

async function getImageDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("vue-char-translate", 1)
        req.onupgradeneeded = () => {
            const db = req.result
            if (!db.objectStoreNames.contains("default")) {
                db.createObjectStore("default")
            }
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })
}

import {openDB} from "idb";
import {DBKey, useIndexedDB} from "@/shared/db/DatabaseUtils.ts";

export enum SharedStore {
    APIConfig = "APIConfig",
}

function sharedDB() {
    return openDB("shared", 1, {
        upgrade(db) {
            db.createObjectStore(SharedStore.APIConfig)
        }
    })
}

export function sharedData<T>(id: DBKey, defaultValue: T, store: SharedStore, debounce: number = null) {
    return useIndexedDB(
        id,
        defaultValue,
        sharedDB,
        {
            store: store,
            db: "shared",
            debounce: debounce,
            deep: true,
        },
    )
}

import {openDB} from "idb";
import {DBKey, useIndexedDB} from "@/shared/db/DatabaseUtils.ts";
import {ref} from "vue";

export class TranslationStorage {
    id = ref(0)
    raw = translationData(this.id, {}, Store.Raw_json, 200)
    translated = translationData(this.id, {}, Store.Translated_json, 200)
    image = translationData<Uint8Array>(this.id, null, Store.Images, 200)
}

enum Store {
    Ids = "Ids",
    Raw_json = "Raw_json",
    Translated_json = "Translated_json",
    Images = "Images",
}

function translationDB() {
    return openDB("card_translation", 1, {
        upgrade(db) {
            db.createObjectStore(Store.Ids)
            db.createObjectStore(Store.Raw_json)
            db.createObjectStore(Store.Translated_json)
            db.createObjectStore(Store.Images)
        }
    })
}

function translationData<T>(id: DBKey, defaultValue: T, store: Store, debounce: number = null) {
    return useIndexedDB(
        id,
        defaultValue,
        translationDB,
        {
            store: store,
            db: "card_translation",
            debounce: debounce,
            deep: true,
        },
    )
}

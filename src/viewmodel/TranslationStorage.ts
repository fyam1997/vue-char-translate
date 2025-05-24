import {openDB} from "idb";
import {useIndexedDB} from "@/shared/db/DatabaseUtils.ts";
import {ref} from "vue";

export class TranslationStorage {
    prompt = translationData("prompt", "", 200)
    raw = translationData("raw", {}, 200)
    translated = translationData("translated", {}, 200)
    image = translationData<Uint8Array>("image", null)
}

function translationDB() {
    return openDB("card_translation", 1, {
        upgrade(db) {
            db.createObjectStore("Translation")
        }
    })
}

function translationData<T>(id: string, defaultValue: T, debounce: number = null) {
    return useIndexedDB(
        ref(id),
        defaultValue,
        translationDB,
        {
            store: "Translation",
            db: "card_translation",
            debounce: debounce,
            deep: true,
        },
    )
}

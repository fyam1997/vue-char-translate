import {openDB} from "idb";
import {useIndexedDB} from "@/shared/db/DatabaseUtils.ts";
import {ref} from "vue";

export class TranslationStorage {
    prompt = translationData("prompt", "You are an expert translator who translates English to Traditional Chinese.\n" +
        "You pay attention to style, formality, idioms, slang etc. and try to convey it in the way a Traditional Chinese speaker would understand.\n" +
        "BE MORE NATURAL.\n" +
        "Specifically, you will be translating text from a role play character card.\n" +
        "To aid you and provide context, You will be given a json of the character card. Return the json with the texts translated.\n" +
        "DO NOT translate the json keys.\n" +
        "DO NOT respond in Markdown format like ```json ```.\n" +
        "DO NOT give explanations.\n" +
        "If it's already in Traditional Chinese looks like gibberish, OUTPUT IT AS IT IS instead.\n" +
        "Translate all character name.\n" +
        "replace all \"\" with 「」 inside json values.\n" +
        "DO NOT USE ＊.\n" +
        "DO NOT translate tags.", 200)
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

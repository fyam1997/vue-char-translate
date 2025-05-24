import {onMounted, Ref, ref, toRaw, watch} from 'vue'
import {IDBPDatabase} from 'idb'
import {watchDebounced} from "@vueuse/core";

export interface UseDBOptions {
    db: string
    store: string
    debounce?: number
    deep?: boolean
}

type DBProvider = () => Promise<IDBPDatabase>

export function useIndexedDB<T>(
    key: Ref,
    defaultValue: T,
    dbProvider: DBProvider,
    options: UseDBOptions,
) {
    const data = ref<T>(defaultValue)

    async function load() {
        const db = await dbProvider()
        const value = await db.get(options.store, key.value)
        if (value !== undefined) {
            data.value = value
        } else {
            data.value = defaultValue
            await save(defaultValue)
        }
    }

    async function save(value: T) {
        const db = await dbProvider()
        await db.put(options.store, toRaw(value), key.value)
    }

    onMounted(load)
    watch(key, load)
    watchDebounced(data, save, {deep: options.deep, debounce: options.debounce})

    return data
}

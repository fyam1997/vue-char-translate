import {onMounted, Ref, ref, toRaw} from 'vue'
import {IDBPDatabase} from 'idb'
import {watchDebounced} from "@vueuse/core";

export interface UseDBOptions {
    db: string
    store: string
    debounce?: number
    deep?: boolean
}

export type DBKey = string | number | Ref<string | number>

type DBProvider = () => Promise<IDBPDatabase>

export function useIndexedDB<T>(
    key: DBKey,
    defaultValue: T,
    dbProvider: DBProvider,
    options: UseDBOptions,
) {
    const data = ref<T>(defaultValue)

    function getKey() {
        return typeof key === 'object' && 'value' in key ? key.value : key
    }

    async function load() {
        const db = await dbProvider()
        const value = await db.get(options.store, getKey())
        if (value !== undefined) data.value = value
    }

    async function save(value: T) {
        const db = await dbProvider()
        await db.put(options.store, toRaw(value), getKey())
    }

    onMounted(load)
    watchDebounced(data, save, {deep: options.deep, debounce: options.debounce})

    return data
}

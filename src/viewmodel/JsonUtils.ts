import {computed, Ref} from "vue";

export function getFlattenArray(json: object): { key: string; value: string }[] {
    const flattenArray: { key: string; value: string }[] = []
    const flatten = (obj: any, parentKey: string = "") => {
        for (const key in obj) {
            const newKey = parentKey ? `${parentKey}.${key}` : key
            if (typeof obj[key] === "object" && obj[key] !== null) {
                flatten(obj[key], newKey)
            } else {
                flattenArray.push({key: newKey, value: obj[key]})
            }
        }
    }
    flatten(json)
    return flattenArray
}

export function setValueByFlattenKey(json: object, flattenKey: string, value: any): any {
    const keys = flattenKey.split(".")
    let current = json
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (!current[key]) {
            current[key] = {}
        }
        current = current[key]
    }
    current[keys[keys.length - 1]] = value
    return json
}

export function parseJsonOrNull(text: string): object {
    try {
        return JSON.parse(text)
    } catch (e) {
        return null
    }
}

export class FlattenJson {
    src: Ref<object>
    flattenArray = computed(() => {
        return getFlattenArray(this.src.value)
    })
    empty = computed(() => {
        return this.flattenArray.value.length == 0
    })

    constructor(src: Ref<object>) {
        this.src = src
    }

    setSrcValue(value: object) {
        this.src.value = value
    }

    getSrcValue(): object {
        return this.src.value
    }

    setValue(flattenKey: string, value: any) {
        setValueByFlattenKey(this.src.value, flattenKey, value)
    }

    isEmpty() {
        return this.empty.value
    }
}

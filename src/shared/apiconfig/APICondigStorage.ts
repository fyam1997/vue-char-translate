import {ref} from "vue";
import {removeSharedData, sharedData, SharedStore} from "@/shared/db/SharedStorage.ts";

export interface APIConfigModel {
    baseURL: string
    apiKey: string
    model: string
}

export interface APIConfigIndex {
    id: number
    name: string
}

export class APIConfigStorage {
    id = sharedData<number>(
        ref("selectedID"),
        0,
        SharedStore.APIConfig,
    )
    idList = sharedData<APIConfigIndex[]>(
        ref("index"),
        [{id: 0, name: "Default"}],
        SharedStore.APIConfig,
    )
    config = sharedData<APIConfigModel>(
        this.id,
        {baseURL: "", apiKey: "", model: ""},
        SharedStore.APIConfig,
    )

    removeConfig(id: number) {
        removeSharedData(id, SharedStore.APIConfig).catch(console.error)
    }
}

import {ref} from "vue";
import {sharedData, SharedStore} from "@/shared/db/SharedStorage.ts";

export interface APIConfigModel {
    baseURL: string
    apiKey: string
    model: string
}

export class APIConfigStorage {
    id = ref(0)
    config = sharedData<APIConfigModel>(
        this.id,
        {baseURL: "", apiKey: "", model: ""},
        SharedStore.APIConfig, 200
    )
}

import {useLocalStorage} from "@vueuse/core";
import {isValidFile, LoadFileType, readFileContent} from "@/viewmodel/ReadFileContent.ts";
import {downloadImageFile, downloadJsonFile} from "@/viewmodel/DownloadResult.ts";
import {APIConfigModel, fetchCompletionResponse} from "@/viewmodel/Translation.ts";
import {computed, ref} from "vue";
import {getFlattenArray, parseJsonOrNull, setValueByFlattenKey} from "@/viewmodel/JsonUtils.ts";

export class ViewModel {
    image = useLocalStorage("raw-image", "")
    imageSrc = computed(() => {
        const encodedImage = this.image.value
        if (!encodedImage) return ''
        return `data:image/png;base64,${encodedImage}`
    })

    prompt = useLocalStorage("translation-prompt", "")
    apiConfig = useLocalStorage<APIConfigModel>("api-config", {
        baseURL: "",
        apiKey: "",
        model: "",
    })

    rawJson = useLocalStorage<object>("raw-json", {})
    flattenRawJson = computed(() => {
        return getFlattenArray(this.rawJson.value)
    })
    translatedJson = useLocalStorage<object>("translated-json", {})

    snackbarMessages = ref<string[]>([])
    loading = ref(false)
    darkTheme = useLocalStorage("app-dark-theme", true)
    theme = computed(() => {
        return this.darkTheme.value ? 'dark' : 'light'
    })
    toggleThemeIcon = computed(() => {
        return this.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
    })

    async loadFile(files: File[] | File, loadFileType: LoadFileType) {
        const file = Array.isArray(files) ? files[0] : files
        if (!isValidFile(file, loadFileType)) {
            this.snackbarMessages.value.push("Illegal File")
            return
        }
        const {json, png} = await readFileContent(file)

        switch (loadFileType) {
            case LoadFileType.JSON:
                this.setRawJson(json)
                break
            case LoadFileType.PNG:
            default:
                this.image.value = png
                this.setRawJson(json)
                break
        }
    }

    setRawJson(obj: object) {
        this.rawJson.value = obj
    }

    setRawJsonValue(key: string, value: any) {
        setValueByFlattenKey(this.rawJson.value, key, value)
    }

    setTranslatedJson(obj: object) {
        this.translatedJson.value = obj
    }

    async translate() {
        if (Object.keys(this.rawJson.value).length === 0) {
            this.snackbarMessages.value.push("Nothing to translate")
            return
        }
        this.loading.value = true
        let text = ""
        const stream = await fetchCompletionResponse(this.apiConfig.value, this.rawJson.value, this.prompt.value)
        for await (const event of stream) {
            text += event.choices[0].delta.content
        }
        this.setTranslatedJson(parseJsonOrNull(text))
        this.loading.value = false
    }

    clearImage() {
        this.image.value = ""
    }

    clearJson() {
        this.rawJson.value = null
        this.translatedJson.value = null
    }

    downloadJson() {
        downloadJsonFile(this.translatedJson.value, "translated.json")
    }

    downloadImage() {
        downloadImageFile(this.translatedJson.value, this.image.value, "translated.png")
    }

    openBugReport() {
        window.open("https://github.com/fyam1997/vue-char-translate", "_blank")
    }

    toggleDarkTheme() {
        this.darkTheme.value = !this.darkTheme.value
    }
}

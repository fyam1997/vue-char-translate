import {useLocalStorage} from "@vueuse/core";
import {isValidFile, LoadFileType, readFileContent} from "@/viewmodel/ReadFileContent.ts";
import {downloadImageFile, downloadJsonFile} from "@/viewmodel/DownloadResult.ts";
import {APIConfigModel, fetchCompletionResponse} from "@/viewmodel/Translation.ts";
import {computed, ref} from "vue";
import {getFlattenArray, isEmpty, parseJsonOrNull, setValueByFlattenKey} from "@/viewmodel/JsonUtils.ts";

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
    rawJsonEmpty = computed(() => {
        return isEmpty(this.rawJson.value)
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

        // ask for confirmation if target field is not empty
        if (png && (!this.image.value || confirm("Replace Image?"))) {
            this.image.value = png
        }
        if (json && (this.rawJsonEmpty.value || confirm("Replace Character Spec Json?"))) {
            this.setRawJson(json)
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
        if (this.rawJsonEmpty.value) {
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
        if (confirm('Clear Image?')) {
            this.image.value = ""
        }
    }

    clearJson() {
        if (confirm('Clear Character Spec Json?')) {
            this.rawJson.value = null
            this.translatedJson.value = null
        }
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

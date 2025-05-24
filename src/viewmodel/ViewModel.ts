import {useLocalStorage} from "@vueuse/core";
import {isValidFile, readFileContent} from "@/viewmodel/ReadFileContent.ts";
import {downloadImageFile, downloadJsonFile} from "@/viewmodel/DownloadResult.ts";
import {fetchCompletionResponse} from "@/viewmodel/Translation.ts";
import {computed, Ref, ref} from "vue";
import {FlattenJson, parseJsonOrNull} from "@/viewmodel/JsonUtils.ts";
import {TranslationStorage} from "@/viewmodel/TranslationStorage.ts";
import {APIConfigModel, APIConfigStorage} from "@/shared/apiconfig/APICondigStorage.ts";

export class ViewModel {
    apiConfig: Ref<APIConfigModel>
    image: Ref<Uint8Array>

    imageSrc = computed(() => {
        if (!this.image.value) return null
        const blob = new Blob([this.image.value], {type: "image/png"})
        return URL.createObjectURL(blob)
    })

    prompt: Ref<string>
    rawJson: FlattenJson
    translatedJson: FlattenJson
    loadingText = ref("")

    snackbarMessages = ref<string[]>([])
    loading = ref(false)
    darkTheme = useLocalStorage("app-dark-theme", true)
    theme = computed(() => {
        return this.darkTheme.value ? 'dark' : 'light'
    })
    toggleThemeIcon = computed(() => {
        return this.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
    })

    constructor(
        private storage: TranslationStorage,
        private apiConfigStorage: APIConfigStorage,
    ) {
        this.apiConfig = this.apiConfigStorage.config
        this.image = this.storage.image
        this.prompt = this.storage.prompt
        this.rawJson = new FlattenJson(this.storage.raw)
        this.translatedJson = new FlattenJson(this.storage.translated)
    }

    async loadDefaultPrompt() {
        // TODO since onMounted will try to read value from DB, if no value, it will save default value, the saving is happen after this
        await new Promise((resolve) => setTimeout(resolve, 200))
        if (!this.prompt.value) {
            this.prompt.value = await (await fetch('./default_prompt.txt')).text()
        }
    }

    async loadFile(files: File[] | File) {
        if (!files) return
        const file = Array.isArray(files) ? files[0] : files
        if (!isValidFile(file)) {
            this.snackbarMessages.value.push("Illegal File")
            return
        }
        const {json, png} = await readFileContent(file)

        // ask for confirmation if target field is not empty
        if (png && (!this.image.value || confirm("Replace Image?"))) {
            this.image.value = png
        }
        if (json && (this.rawJson.isEmpty() || confirm("Replace Character Spec Json?"))) {
            this.setRawJson(json)
        }
    }

    setRawJson(obj: object) {
        this.rawJson.setSrcValue(obj)
    }

    setTranslatedJson(obj: object) {
        this.translatedJson.setSrcValue(obj)
    }

    async translate() {
        if (this.rawJson.isEmpty()) {
            this.snackbarMessages.value.push("Nothing to translate")
            return
        }
        const apiConfig = this.apiConfig.value
        if (!apiConfig.baseURL || !apiConfig.model) {
            this.snackbarMessages.value.push("API configuration is empty")
            return
        }

        this.loading.value = true
        this.setTranslatedJson({})
        this.loadingText.value = ""
        const stream = await fetchCompletionResponse(
            this.apiConfig.value,
            this.rawJson.getSrcValue(),
            this.prompt.value
        )
        for await (const event of stream) {
            this.loadingText.value += event.choices[0].delta.content
        }
        this.setTranslatedJson(parseJsonOrNull(this.loadingText.value))
        this.loadingText.value = ""
        this.loading.value = false
    }

    async clearImage() {
        if (confirm('Clear Image?')) {
            this.image.value = null
        }
    }

    clearJson() {
        if (confirm('Clear Character Spec Json?')) {
            this.setRawJson({})
            this.setTranslatedJson({})
        }
    }

    downloadJson() {
        downloadJsonFile(this.translatedJson.getSrcValue(), "translated.json")
    }

    downloadImage() {
        downloadImageFile(this.translatedJson.getSrcValue(), this.image.value, "translated.png")
    }

    openBugReport() {
        window.open("https://github.com/fyam1997/vue-char-translate", "_blank")
    }

    toggleDarkTheme() {
        this.darkTheme.value = !this.darkTheme.value
    }
}

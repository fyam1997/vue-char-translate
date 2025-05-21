import {useLocalStorage} from "@vueuse/core";
import {isValidFile, LoadFileType, readFileContent} from "@/viewmodel/ReadFileContent.ts";
import {downloadImageFile, downloadJsonFile} from "@/viewmodel/DownloadResult.ts";
import {APIConfigModel, fetchCompletionResponse} from "@/viewmodel/Translation.ts";
import {computed, ref} from "vue";
import {FlattenJson, parseJsonOrNull} from "@/viewmodel/JsonUtils.ts";
import {loadImage, saveImage} from "@/viewmodel/ImageCache.ts";

export class ViewModel {
    image = ref<Uint8Array>(null)
    imageSrc = computed(() => {
        if (!this.image.value) return null
        const blob = new Blob([this.image.value], {type: "image/png"})
        return URL.createObjectURL(blob)
    })

    prompt = useLocalStorage("translation-prompt", "You are an expert translator who translates English to Traditional Chinese. You pay attention to style, formality, idioms, slang etc and try to convey it in the way a Traditional Chinese speaker would understand.\n" +
        "BE MORE NATURAL.\n" +
        "Specifically, you will be translating text from a role play charactor card.\n" +
        "To aid you and provide context, You will be given a json of the charactor card. Return the json with the texts translated. \n" +
        "DO NOT translate the json keys.\n" +
        "DO NOT respond in markdown format like ```json ```.\n" +
        "DO NOT give explanations.\n" +
        "If it's already in Traditional Chineseor looks like gibberish, OUTPUT IT AS IT IS instead.\n" +
        "Translate all charactor name.\n" +
        "repalce all \"\" with 「」 in side json values.")
    apiConfig = useLocalStorage<APIConfigModel>("api-config", {
        baseURL: "",
        apiKey: "",
        model: "",
    })

    rawJson = new FlattenJson(useLocalStorage<object>("raw-json", {}))
    translatedJson = new FlattenJson(useLocalStorage<object>("translated-json", {}))

    snackbarMessages = ref<string[]>([])
    loading = ref(false)
    darkTheme = useLocalStorage("app-dark-theme", true)
    theme = computed(() => {
        return this.darkTheme.value ? 'dark' : 'light'
    })
    toggleThemeIcon = computed(() => {
        return this.darkTheme.value ? 'md:light_mode' : 'md:dark_mode'
    })

    async loadCachedImage() {
        this.image.value = await loadImage()
    }

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
            await saveImage(png)
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
        this.loading.value = true
        let text = ""
        const stream = await fetchCompletionResponse(
            this.apiConfig.value,
            this.rawJson.getSrcValue(),
            this.prompt.value
        )
        for await (const event of stream) {
            text += event.choices[0].delta.content
        }
        this.setTranslatedJson(parseJsonOrNull(text))
        this.loading.value = false
    }

    clearImage() {
        if (confirm('Clear Image?')) {
            this.image.value = null
        }
    }

    clearJson() {
        if (confirm('Clear Character Spec Json?')) {
            this.rawJson.setSrcValue({})
            this.translatedJson.setSrcValue({})
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

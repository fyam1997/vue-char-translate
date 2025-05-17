import {useLocalStorage} from "@vueuse/core";
import {isValidFile, LoadFileType, readFileContent} from "@/viewmodel/ReadFileContent.ts";
import {SingleShotEvent} from "@/viewmodel/SingleShotEvent.ts";
import {downloadImageFile, downloadJsonFile} from "@/viewmodel/DownloadResult.ts";
import {APIConfigModel, fetchCompletionResponse} from "@/viewmodel/Translation.ts";
import {ref} from "vue";

export class ViewModel {
    image = useLocalStorage("raw-image", "")
    rawJson = useLocalStorage("raw-json", "")
    prompt = useLocalStorage("translation-prompt", "")
    translatedJson = useLocalStorage("translated-json", "")

    snackbarMessage = new SingleShotEvent<string>()
    loading = ref(false)
    darkTheme = useLocalStorage("app-dark-theme", true)
    apiConfig = useLocalStorage<APIConfigModel>("api-config", {
        baseURL: "",
        apiKey: "",
        model: "",
    })

    async loadFile(files: File[] | File, loadFileType: LoadFileType) {
        const file = Array.isArray(files) ? files[0] : files
        if (!isValidFile(file, loadFileType)) {
            this.snackbarMessage.emit("Illegal File")
            return
        }
        const {json, png} = await readFileContent(file)

        switch (loadFileType) {
            case LoadFileType.JSON:
                this.rawJson.value = json
                break
            case LoadFileType.PNG:
                this.image.value = png
                break
            case LoadFileType.BOTH:
            default:
                this.rawJson.value = json
                this.image.value = png
                break
        }
    }

    async translate() {
        if (this.rawJson.value === "") {
            this.snackbarMessage.emit("Nothing to translate")
            return
        }
        this.loading.value = true
        this.translatedJson.value = ""
        const stream = await fetchCompletionResponse(this.apiConfig.value, this.rawJson.value, this.prompt.value)
        for await (const event of stream) {
            this.translatedJson.value += event.choices[0].delta.content
        }
        this.loading.value = false
    }

    clearImage() {
        this.image.value = ""
    }

    clearJson() {
        this.rawJson.value = ""
        this.translatedJson.value = ""
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

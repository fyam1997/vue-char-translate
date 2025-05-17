import {Base64} from "js-base64";
import {addMetadata} from "meta-png";

export function downloadJsonFile(json: string, fileName: string) {
    const blob = new Blob([json], {type: "application/json"})
    downloadBlob(blob, fileName)
}

export function downloadImageFile(json: string, base64Image: string, fileName: string) {
    const imageArr = Base64.toUint8Array(base64Image)
    const compactJson = JSON.stringify(JSON.parse(json))
    const charaData = Base64.encode(compactJson)
    const embeddedImageArr = addMetadata(imageArr, "chara", charaData)
    const blob = new Blob([embeddedImageArr], {type: "image/png"})
    downloadBlob(blob, fileName)
}

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}
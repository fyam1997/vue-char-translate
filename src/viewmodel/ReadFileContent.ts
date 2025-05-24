import {getMetadata} from "meta-png";
import {Base64} from "js-base64";
import {parseJsonOrNull} from "@/viewmodel/JsonUtils.ts";

export function isValidFile(file: File): boolean {
    const allowedTypes = ['image/png', 'application/json']
    const fileTypeValid = allowedTypes.includes(file.type)

    const maxSizeInMB = 20
    const fileSizeValid = file.size <= maxSizeInMB * 1024 * 1024

    return fileTypeValid && fileSizeValid
}

export async function readFileContent(file: File): Promise<FileContent> {
    if (file.type === 'image/png') {
        return await readPngContent(file);
    } else {
        return {
            json: parseJsonOrNull(await file.text()),
            png: null,
        };
    }
}

async function readPngContent(file: File): Promise<FileContent> {
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    let decodedJson: string | null
    try {
        const encodedJson = getMetadata(uint8Array, "chara")
        decodedJson = JSON.stringify(JSON.parse(Base64.decode(encodedJson)), null, 2)
    } catch (e) {
        decodedJson = null
    }
    return {
        json: parseJsonOrNull(decodedJson),
        png: uint8Array,
    }
}

interface FileContent {
    png: Uint8Array | null
    json: object | null
}

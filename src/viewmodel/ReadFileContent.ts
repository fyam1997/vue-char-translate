import {getMetadata} from "meta-png";
import {Base64} from "js-base64";

export function isValidFile(file: File, loadFileType: LoadFileType): boolean {
    const allowedTypes = getAllowedTypes(loadFileType)
    const fileTypeValid = allowedTypes.includes(file.type)

    const maxSizeInMB = 10
    const fileSizeValid = file.size <= maxSizeInMB * 1024 * 1024

    return fileTypeValid && fileSizeValid
}

function getAllowedTypes(loadFileType: LoadFileType): string[] {
    switch (loadFileType) {
        case LoadFileType.JSON:
            return ['application/json'];
        case LoadFileType.PNG:
            return ['image/png'];
        case LoadFileType.BOTH:
        default:
            return ['application/json', 'image/png'];
    }
}

export async function readFileContent(file: File): Promise<FileContent> {
    if (file.type === 'image/png') {
        return await readPngContent(file);
    } else {
        return {
            json: await file.text(),
            png: null,
        };
    }
}

async function readPngContent(file: File): Promise<FileContent> {
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    let decodedJson
    try {
        const encodedJson = getMetadata(uint8Array, "chara")
        decodedJson = Base64.decode(encodedJson)
    } catch (e) {
        decodedJson = null
    }
    return {
        json: decodedJson,
        png: Base64.fromUint8Array(uint8Array),
    }
}

export enum LoadFileType {
    JSON,
    PNG,
    BOTH,
}

interface FileContent {
    png: string | null
    json: string | null
}

import OpenAI from "openai";
import {
    ChatCompletionChunk,
    ChatCompletionCreateParamsStreaming
} from "openai/src/resources/chat/completions/completions";
import {APIPromise} from "openai/src/core";
import {Stream} from "openai/src/streaming";

export interface APIConfigModel {
    baseURL: string
    apiKey: string
    model: string
}

export async function fetchCompletionResponse(
    apiConfig: APIConfigModel,
    json: string,
    prompt: string,
): APIPromise<Stream<ChatCompletionChunk>> {
    const client = new OpenAI({
        baseURL: apiConfig.baseURL,
        apiKey: apiConfig.apiKey,
        dangerouslyAllowBrowser: true,
    })
    const requestMessages = [
        {
            role: "system",
            content: prompt,
        },
        {
            role: "user",
            content: json,
        },
    ]
    const requestBody: ChatCompletionCreateParamsStreaming = {
        model: apiConfig.model,
        messages: requestMessages,
        stream: true
    }
    return client.chat.completions.create(requestBody)
}

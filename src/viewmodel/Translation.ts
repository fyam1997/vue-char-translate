import OpenAI from "openai";
import {APIConfigModel} from "@/shared/apiconfig/APICondigStorage.ts";

export async function fetchCompletionResponse(
    apiConfig: APIConfigModel,
    json: object,
    prompt: string,
) {
    const client = new OpenAI({
        baseURL: apiConfig.baseURL,
        apiKey: apiConfig.apiKey,
        dangerouslyAllowBrowser: true,
    })
    // declare as any[] to suppress ChatCompletionMessageParam's warning
    const requestMessages: any[] = [
        {
            role: "system",
            content: prompt,
        },
        {
            role: "user",
            content: JSON.stringify(json),
        },
    ]
    return client.chat.completions.create({
        model: apiConfig.model,
        messages: requestMessages,
        stream: true
    })
}

export async function* yieldText(text: string): AsyncIterable<string> {
    yield* text
}

export async function* yieldTextWithDelay(text: string, delayMs: number): AsyncIterable<string> {
    for await (const value of text) {
        if (delayMs > 0) {
            await delay(delayMs)
        }
        yield value
    }
}

export async function delay(delayMs: number) {
    return new Promise(resolve => setTimeout(resolve, delayMs))
}

export async function* transformAsyncIterable<T, U>(
    iterable: AsyncIterable<T>,
    transformFn: (value: T) => U | Promise<U>
): AsyncIterable<U> {
    for await (const value of iterable) {
        yield await transformFn(value)
    }
}

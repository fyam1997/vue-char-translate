export async function* yieldText(text: string): AsyncIterable<string> {
    yield* text
}

export async function* yieldArray<T>(arr: T[]): AsyncIterable<T> {
    yield* arr
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

export async function* transform<T, U>(
    iterable: AsyncIterable<T>,
    transformFn: (value: T) => U
): AsyncIterable<U> {
    for await (const value of iterable) {
        yield transformFn(value)
    }
}

export async function* flatten(iterable: AsyncIterable<string>): AsyncIterable<string> {
    for await (const chunk of iterable) {
        yield* chunk
    }
}


export async function* transformAndFlatten<T>(
    iterable: AsyncIterable<T>,
    transformFn: (value: T) => string
): AsyncIterable<string> {
    yield* flatten(transform(iterable, transformFn))
}

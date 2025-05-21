export function parseJsonOrNull(text: string): object {
    try {
        return JSON.parse(text)
    } catch (e) {
        return null
    }
}

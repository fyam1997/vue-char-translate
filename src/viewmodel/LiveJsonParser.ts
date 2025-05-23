type JSONValue = string | number | boolean | null | object | JSONValue[]

export class LiveJSONParser {
    source: AsyncIterable<string>
    cursor: IteratorResult<string>

    constructor(source: AsyncIterable<string>) {
        this.source = source
        this.cursor = {done: false, value: ""}
    }

    async readObject(obj: object) {
        await this.skipSpaces()
        await this.next() // skip starting {
        await this.skipSpaces()

        while (this.value !== '}') {
            await this.readObjectEntry(obj)
            await this.readUntilChar('},')
        }
        await this.next() // skip ending }
    }

    async readArray(arr: JSONValue[]) {
        await this.skipSpaces()
        await this.next() // skip starting [
        await this.skipSpaces()

        while (this.value !== ']') {
            await this.readArrayItem(arr)
            await this.readUntilChar('],')
        }
        await this.next() // skip ending ]
    }

    async readObjectEntry(obj: object) {
        await this.readUntilChar('"')
        const key = await this.readString()

        await this.skipSpaces()
        await this.skipChars(':')
        await this.skipSpaces()

        switch (this.value) {
            case '"':
                obj[key] = ""
                for await (const char of this.yieldString()) {
                    obj[key] += char
                }
                break;
            case '[':
                const newArr = []
                obj[key] = newArr
                await this.readArray(newArr)
                break;
            case '{':
                const newObj = {}
                obj[key] = newObj
                await this.readObject(newObj)
                break;
            default:
                obj[key] = await this.readValue()
                break;
        }
    }

    async readArrayItem(arr: JSONValue[]) {
        await this.skipChars('[, \t\n\r')
        const valueStart = this.cursor.value
        switch (valueStart) {
            case '"':
                arr.push("")
                for await (const char of this.yieldString()) {
                    arr[arr.length - 1] += char
                }
                break
            case '[':
                const newArr = []
                arr.push(newArr)
                await this.readArray(newArr)
                break
            case '{':
                const newObj = {}
                arr.push(newObj)
                await this.readObject(newObj)
                break
            default:
                arr.push(await this.readValue())
                break
        }
    }

    async readString(): Promise<string> {
        const chars = await Array.fromAsync(this.yieldString())
        return chars.join("")
    }

    async* yieldString(): AsyncIterable<string> {
        await this.next() // skip starting "
        while (this.value !== '"') {
            if (this.value === '\\') {
                yield this.readEscape()
            } else {
                yield this.value
            }
            await this.next()
        }
        await this.next() // skip ending "
    }

    async readEscape(): Promise<string> {
        await this.next(false) // skip '\\'
        switch (this.value) {
            case '"':
                return '"'
            case '\\':
                return '\\'
            case '/':
                return '/'
            case 'b':
                return '\b'
            case 'f':
                return '\f'
            case 'n':
                return '\n'
            case 'r':
                return '\r'
            case 't':
                return '\t'
            case 'u':
                const code = await this.read(4)
                return String.fromCharCode(parseInt(code, 16))
        }
    }

    /**
     * read number | boolean | null
     */
    async readValue(): Promise<JSONValue> {
        let text = await this.readUntilChar(',} \t\n\r')
        if (text === 'true') return true
        if (text === 'false') return false
        if (text === 'null') return null
        return Number(text)
    }

    get value(): string {
        return this.cursor.value
    }

    get iterator() {
        return this.source[Symbol.asyncIterator]()
    }

    async next(allowDone: boolean = false): Promise<string> {
        if (!allowDone && this.cursor.done) {
            throw new Error("Iterable is done unexpectedly")
        }
        this.cursor = await this.iterator.next()
        return this.value
    }

    /**
     * after await this function, cursor will be pointed to the matched character,
     * @param condition condition to end waiting.
     * @return the characters before match, start inclusive, end exclusive.
     */
    async readUntil(
        condition: (char: string) => boolean,
    ): Promise<string> {
        const arr = await Array.fromAsync(this.yieldUntil(condition))
        return arr.join('')
    }

    async readUntilChar(chars: string): Promise<string> {
        return await this.readUntil((char) => chars.includes(char))
    }

    async skipChars(chars: string): Promise<string> {
        return await this.readUntil((char) => !chars.includes(char))
    }

    async skipSpaces(): Promise<void> {
        await this.skipChars(' \t\n\r')
    }

    async read(count: number): Promise<string> {
        let i = 0
        return await this.readUntil(() => i++ == count)
    }

    async* yieldUntil(
        condition: (char: string) => boolean,
    ): AsyncIterable<string> {
        while (!condition(this.value)) {
            yield this.value
            await this.next()
        }
    }
}

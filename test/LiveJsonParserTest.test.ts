import {assert, describe, it} from 'vitest'
import {LiveJSONParser} from "@/viewmodel/LiveJsonParser.ts";
import {yieldText} from "@/viewmodel/AsyncUtils.ts";

describe('read object', () => {
    async function test(obj: object) {
        const text = JSON.stringify(obj, null, 2)
        const result = {}
        const parser = new LiveJSONParser(yieldText(text))
        await parser.readObject(result)
        const actual = JSON.stringify(result, null, 2)
        assert.equal(actual, text)
    }

    // // basic
    it('test', () => test({"score": 123}))
    it('test', () => test({"score": 123.01}))
    it('test', () => test({"score": true}))
    it('test', () => test({"score": false}))
    it('test', () => test({"score": null}))
    it('test', () => test({"score": null, "score123": 123, "scoret": true, "scoref": false}))

    // Nested
    it('test', () => test({"score": {"a": 123}}))
    it('test', () => test({"score": {"a": 123}, "score2": {"a": 123}}))

    // string
    it('test', () => test({"score": "123"}))
    it('test', () => test({score: "\"hey\""}))
    it('test', () => test({score: "\u000A"}))
    it('test', () => test({score: "\\"}))
    it('test', () => test({"score": {"a": "123"}, "score2": {"a": "123"}, "score4": "123"}))

    // array
    it('test', () => test({"score": ["123"]}))
    it('test', () => test({"score": ["123", "456"]}))
    it('test', () => test({"score": [{}, {}]}))
    it('test', () => test({"score": []}))
})

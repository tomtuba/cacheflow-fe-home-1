import {capitalizeFirstLetter, showCurrency} from "../converters";

describe("test for showCurrency", () => {
    it ("should convert string currency", () => {
        const result = showCurrency("52");
        expect(result).toEqual("$52.00");
    })
    it ("should convert number currency", () => {
        const result = showCurrency(52);
        expect(result).toEqual("$52.00");
    })
    it ("should convert undefined as zero", () => {
        const result = showCurrency(undefined);
        expect(result).toEqual("$0.00");
    })

})

describe("test for capitalizeFirstLetter", () => {
    it ("should capitalize word", () => {
        const result = capitalizeFirstLetter("frog")
        expect(result).toEqual("Frog");
    })

    it ("should keep capitalized word the same", () => {
        const result = capitalizeFirstLetter("FROG")
        expect(result).toEqual("FROG");
    })

    it ("should keep capitalized word the same", () => {
        const result = capitalizeFirstLetter(undefined)
        expect(result).toBeUndefined()
    })
})
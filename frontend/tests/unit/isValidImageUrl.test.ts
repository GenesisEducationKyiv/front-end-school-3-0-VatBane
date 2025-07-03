import { describe, it, expect } from "vitest";
import { isValidImageUrl } from "../../src/utils/validationUtils";


describe("isValidImageUrl", () => {
    it("returns true for valid image url", () => {
        expect(isValidImageUrl("https://random.image.storage/random.png")).toBe(true);
    })
    it("returns false for random string", () => {
        expect(isValidImageUrl("askfiufvycq9831y872ti&@!&^#@*!(*")).toBe(false);
    })
    it("returns false for url without mime type included", () => {
        expect(isValidImageUrl("http://random.image.storage/asdasda")).toBe(false)
    })
    it("returns false for general url", () => {
        expect(isValidImageUrl("https://random.image.url")).toBe(false)
    })
})
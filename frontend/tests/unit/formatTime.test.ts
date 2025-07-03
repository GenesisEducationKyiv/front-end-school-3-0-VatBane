import { describe, it, expect } from "vitest";
import { formatTime } from "../../src/utils/formatTime";


describe("formatTime", () => {
    it('formats 0 seconds as 0:00', () => {
        expect(formatTime(0)).toBe('0:00');
    });
    it('formats 1 minute as 1:00', () => {
        expect(formatTime(60)).toBe('1:00');
    });
    it('formats float number with rounding', () => {
        expect(formatTime(4.68)).toBe("0:04");
    })
    it("formats hours as minutes", () => {
        expect(formatTime(3601)).toBe("60:01")
    })
})
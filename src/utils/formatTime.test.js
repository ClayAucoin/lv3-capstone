
import { expect, describe, it } from "vitest";
import { formatTime } from "./helpers"

// formatTime function
//    formatTime('01:41:11') → string
//    would output: 1h 41m
describe("formatTime(timeStr)", () => {
  const cases = [
    // --- Full HH:MM:SS ---
    { name: "handles full time 01:41:11 → 1h 41m", input: "01:41:11", expected: "1h 41m", },
    { name: "handles 00:41:11 → 41m (no hours)", input: "00:41:11", expected: "41m", },
    { name: "handles exact hour 02:00:00 → 2h 0m", input: "02:00:00", expected: "2h 0m", },
    { name: "handles large hour values 10:05:59 → 10h 5m", input: "10:05:59", expected: "10h 5m", },
    { name: "handles very large values 99:59:59 → 99h 59m", input: "99:59:59", expected: "99h 59m", },

    // --- MM:SS input ---
    { name: "treats 41:11 as 41m (MM:SS)", input: "41:11", expected: "41m", },
    { name: "handles MM:SS that rolls into hours (75:30 → 1h 15m)", input: "75:30", expected: "1h 15m", },
    { name: "handles small MM:SS values (00:09 → 0m)", input: "00:09", expected: "0m", },

    // --- SS-only ---
    { name: "handles seconds-only under a minute (09 → 0m)", input: "09", expected: "0m", },
    { name: "handles 60 seconds → 1m", input: "60", expected: "1m", },
    { name: "handles large seconds (3600 → 60m)", input: "3600", expected: "1h 0m", },
    { name: "handles large seconds (7265 → 2h 1m)", input: "7265", expected: "2h 1m", },

    // --- Zero / boundary cases ---
    { name: "handles 00:00:09 → 0m", input: "00:00:09", expected: "0m", },
    { name: "handles 00:00:00 → 0m", input: "00:00:00", expected: "0m", },
    { name: "handles 00:00 → 0m", input: "00:00", expected: "0m", },
    { name: "handles 0 → 0m", input: "0", expected: "0m", },
    { name: "handles extra padding 000:00:00 → 0m", input: "000:00:00", expected: "0m", },
    { name: "returns 0m for out of bounds (01:33:42:09 → 0m)", input: "01:33:42:09", expected: "0m", },

    // --- Weird but numeric ---
    { name: "handles uneven digit lengths (1:2:3 → 1h 2m)", input: "1:2:3", expected: "1h 2m", },
    { name: "handles minutes overflow (00:61:00 → 1h 1m)", input: "00:61:00", expected: "1h 1m", },
    { name: "handles max minute b4 roll over (59:59 → 59m)", input: "59:59", expected: "59m", },

    // --- Invalid / null / NaN-producing inputs ---
    { name: "returns 0m for non-numeric input like 'abc'", input: "abc", expected: "0m", },
    { name: "returns 0m for malformed strings like '1::11'", input: "1::11", expected: "1h 0m", },
    { name: "returns 0m for empty string", input: "", expected: "0m", },
    { name: "returns 0m for completely invalid '::'", input: "::", expected: "0m", },
    { name: "returns 0m for null (null → 0m)", input: null, expected: "0m", },

    // --- whitespace inputs ---
    { name: "handles whitespace (  01:41:11 → 1h 41m)", input: "  01:41:11  ", expected: "1h 41m", },

  ];

  cases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = formatTime(input);
      expect(result).toBe(expected);
    });
  });

  // Optional: explicit NaN demo test
  it("demonstrates how Number('abc') becomes NaN", () => {
    const x = Number("abc");
    expect(x).toBeNaN(); // Vitest matcher
    expect(Number.isNaN(x)).toBe(true);
  });
});

// formatTime function
//    formatTime('01:41:11') → string
//    would output: 1h 41m
// describe("formatTime function", () => {

// it("should handle valid duration", () => {
//   const result = formatTime("01:41:11")
//   expect(result).toBe("1h 41m")
// })

// it("should handle 0 hours", () => {
//   const result = formatTime("00:41:11")
//   expect(result).toBe("41m")
// })

// it("should handle exact hour", () => {
//   const result = formatTime("02:00:00")
//   expect(result).toBe("2h 0m")
// })

// it("should handle large hour", () => {
//   const result = formatTime("10:05:59")
//   expect(result).toBe("10h 5m")
// })

// it("should handle large values", () => {
//   const result = formatTime("99:59:59")
//   expect(result).toBe("99h 59m")
// })

// it("should handle under 10 seconds", () => {
//   const result = formatTime("00:09")
//   expect(result).toBe("0m")
// })

// it("should handle max minute b4 roll over", () => {
//   const result = formatTime("59:59")
//   expect(result).toBe("59m")
// })

// it("should roll over into hours", () => {
//   const result = formatTime("75:30")
//   expect(result).toBe("1h 15m")
// })

// it("should handle under 10 seconds", () => {
//   const result = formatTime("09")
//   expect(result).toBe("0m")
// })

// it("should handle exactly one minute", () => {
//   const result = formatTime("60")
//   expect(result).toBe("1m")
// })

// it("should handle exactly one hour", () => {
//   const result = formatTime("3600")
//   expect(result).toBe("1h 0m")
// })

// it("should handle large seconds", () => {
//   const result = formatTime("7265")
//   expect(result).toBe("2h 1m")
// })

// it("should handle all zeros", () => {
//   const result = formatTime("00:00:00")
//   expect(result).toBe("0m")
// })

// it("should handle 0 mm:ss", () => {
//   const result = formatTime("00:00")
//   expect(result).toBe("0m")
// })

// it("should handle weird padding", () => {
//   const result = formatTime("000:00:00")
//   expect(result).toBe("0m")
// })

// it("should handle whitespace", () => {
//   const result = formatTime("  01:41:11 ")
//   expect(result).toBe("1h 41m")
// })

// it("should handle uneven digit length segments", () => {
//   const result = formatTime("1:2:3")
//   expect(result).toBe("1h 2m")
// })

// it("should handle strings", () => {
//   const result = formatTime("abc")
//   expect(result).toBe("0m")
// })

// it("should handle malformed", () => {
//   const result = formatTime("1::11")
//   expect(result).toBe("1h 0m")
// })

// it("should handle missing zeros", () => {
//   const result = formatTime("::")
//   expect(result).toBe("0m")
// })

// it("should handle empty string", () => {
//   const result = formatTime("")
//   expect(result).toBe("0m")
// })

// it("should handle null", () => {
//   const result = formatTime(null)
//   expect(result).toBe("0m")
// })

// it("should handle minutes should roll over", () => {
//   const result = formatTime("1:61:00")
//   expect(result).toBe("2h 1m")
// })

// it("should handle time out of range", () => {
//   const result = formatTime("01:33:42:09")
//   expect(result).toBe("0m")
// })

// it("should handle missing hour", () => {
//   const result = formatTime("42:09")
//   expect(result).toBe("42m")
// })

// it("should handle not time", () => {
//   const result = formatTime("42")
//   expect(result).toBe("0m")
// })

// })


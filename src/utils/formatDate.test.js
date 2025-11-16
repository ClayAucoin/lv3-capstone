// formatDate.test.js

import { expect, describe, it } from "vitest";
import { formatDate, formatISODate } from "./helpers"

// formatISODate function
//    formatISODate('2020-03-15') → date
//    would output: Mar 15, 2020
describe("formatISODate", () => {
  const cases = [
    // basic US-style dates
    { desc: "handles basic US-style dates", input: "1/1/2000", expected: "Jan 1, 2000" },
    { desc: "handles basic US-style dates", input: "01/01/2000", expected: "Jan 1, 2000" },
    { desc: "handles basic US-style dates", input: "12/25/1999", expected: "Dec 25, 1999" },

    // 2-digit year formats (depending on how JS parses them)
    { desc: "handles 2-digit year formats", input: "01/01/00", expected: "Jan 1, 2000" },
    { desc: "handles 2-digit year formats", input: "1/1/00", expected: "Jan 1, 2000" },

    // ISO-like format
    { desc: "handles ISO-like format", input: "2020-03-15", expected: "Mar 15, 2020" },

    // month name formats
    { desc: "handles month name formats", input: "Jan 5 2021", expected: "Jan 5, 2021" },
    { desc: "handles full month name formats", input: "January 5, 2021", expected: "Jan 5, 2021" },

    // Whitespace around input
    { desc: "handles whitespace", input: "  03/05/2020  ", expected: "Mar 5, 2020" },

    // leap year
    { desc: "handles leap years", input: "02/29/2000", expected: "Feb 29, 2000" },
    { desc: "handles not a leap year", input: "02/29/1900", expected: "Mar 1, 1900" },

    // others
    { desc: "handles no comma", input: "Jan 5 2011", expected: "Jan 5, 2011" },
    { desc: "handles weird year", input: "1/1/5", expected: "Jan 1, 2005" },
    { desc: "handles very early date", input: "0001-01-01", expected: "Jan 1, 1901" },
    { desc: "handles stray zeros", input: "3/4/020", expected: "Mar 4, 2020" },

    // bad dates
    { desc: "returns original string for invalid dates", input: "hello", expected: "hello" },
    { desc: "returns original string for invalid dates", input: "14/32/00", expected: "14/32/00" },
  ];

  cases.forEach(({ desc, input, expected }) => {
    it(`${desc ? desc : 'formats'} "${input}" as "${expected}"`, () => {
      const result = formatISODate(input);
      expect(result).toBe(expected);
    });
  });

  it("returns empty string for falsy input", () => {
    expect(formatISODate("")).toBe("");
    expect(formatISODate(null)).toBe("");
    expect(formatISODate(undefined)).toBe("");
  });

});



// formatDate function
//    formatDate('1/1/2000') → date
//    would output: Jan 1, 2000
// describe("formatDate function", () => {
// it("should handle single digit month and day (1/1/2000)", () => {
//   const result = formatDate("1/1/2000")
//   expect(result).toBe("Jan 1, 2000")
// })

// it("should handle double digit month and day (01/01/2000)", () => {
//   const result = formatDate("01/01/2000")
//   expect(result).toBe("Jan 1, 2000")
// })

// it("should handle Christmas 1999", () => {
//   const result = formatDate("12/25/1999")
//   expect(result).toBe("Dec 25, 1999")
// })

// it("should handle Independence Day", () => {
//   const result = formatDate("7/4/1776")
//   expect(result).toBe("Jul 4, 1776")
// })

// it("should handle valid leap year", () => {
//   const result = formatDate("02/29/2000")
//   expect(result).toBe("Feb 29, 2000")
// })

// it("should handle no comma", () => {
//   const result = formatDate("Jan 5 2011")
//   expect(result).toBe("Jan 5, 2011")
// })

// it("should handle full month", () => {
//   const result = formatDate("January 5, 2021")
//   expect(result).toBe("Jan 5, 2021")
// })

// it("should handle very early date 0001-01-01 to Dec 31, 1", () => {
//   const result = formatDate("0001-01-01")
//   expect(result).toBe("Dec 31, 1")
// })

// it("should handle super weird year 1/1/5 to Jan 1, 2005", () => {
//   const result = formatDate("1/1/5")
//   expect(result).toBe("Jan 1, 2005")
// })

// it("should handle extra spaces", () => {
//   const result = formatDate(" 03/05/2020 ")
//   expect(result).toBe("Mar 5, 2020")
// })

// it("should handle stray zeros", () => {
//   const result = formatDate("3/4/020")
//   expect(result).toBe("Mar 4, 2020")
// })

// it("should handle not a leap year", () => {
//   const result = formatDate("02/29/1900")
//   expect(result).toBe("Mar 1, 1900")
// })

//   it("should handle bad date", () => {
//     const result = formatDate("14/32/00")
//     expect(result).toBe("14/32/00")
//   })
// })


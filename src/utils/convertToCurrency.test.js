import { expect, describe, it } from "vitest";
import { convertToCurrency } from "./helpers"

// convertToCurrency function
//    convertToCurrency(123456789) → currency
//    would output: $123,456,789
describe("convertToCurrency function", () => {
  it("should handle converting number to currency", () => {
    const result = convertToCurrency(123456789)
    expect(result).toBe("$123,456,789")
  })

  it("should handle currency with cents", () => {
    const result = convertToCurrency(100.54)
    expect(result).toBe("$101")
  })

  it("should handle large number", () => {
    const result = convertToCurrency(279848621735354)
    expect(result).toBe("$279,848,621,735,354")
  })
})


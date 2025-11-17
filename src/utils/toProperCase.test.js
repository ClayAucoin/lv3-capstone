// toProperCase.test.js

import { expect, describe, it } from "vitest";
import { toProperCase } from "./helpers"

// toProperCase function
//    toProperCase('proper case text') → string
//    would output: Proper Case Text
describe("toProperCase('proper case text') function", () => {
  it("should output proper case name", () => {
    const result = toProperCase("Alex")
    expect(result).toBe("Alex")
  })

  it("should handle lower case", () => {
    const result = toProperCase("alex")
    expect(result).toBe("Alex")
  })

  it("should handle upper case", () => {
    const result = toProperCase("ALEX")
    expect(result).toBe("Alex")
  })

  it("should handle mixed case", () => {
    const result = toProperCase("aLeX")
    expect(result).toBe("Alex")
  })

  it("should handle inverted case", () => {
    const result = toProperCase("aLEX")
    expect(result).toBe("Alex")
  })

  it("should handle long strings with mixed case", () => {
    const result = toProperCase("HubErt bLAiNE WOLFeSchlegelSTeINhauseNbErGErdOrff Sr.")
    expect(result).toBe("Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.")
  })
})


import { expect, describe, it } from "vitest";
import { displayName } from "./helpers"

// displayName function
//    displayName({ fname: 'Bob', lname: 'Newhart'}) → string
//    would output: Bob NewHart
describe("displayName function", () => {
  it("should display first and last name", () => {
    const result = displayName({ fname: "Clay", lname: "Aucoin" })
    expect(result).toBe("Clay Aucoin")
  })

  it("should handle lower case", () => {
    const result = displayName({ fname: "clay", lname: "aucoin" })
    expect(result).toBe("Clay Aucoin")
  })

  it("should handle mixed case", () => {
    const result = displayName({ fname: "cLaY", lname: "aUcoIn" })
    expect(result).toBe("Clay Aucoin")
  })

  it("should display first name", () => {
    const result = displayName({ fname: "Santa" })
    expect(result).toBe("Santa")
  })

  it("should handle lower case", () => {
    const result = displayName({ fname: "santa" })
    expect(result).toBe("Santa")
  })

  it("should handle mixed case", () => {
    const result = displayName({ fname: "SaNta" })
    expect(result).toBe("Santa")
  })
})


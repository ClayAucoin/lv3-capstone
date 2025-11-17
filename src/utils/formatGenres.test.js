// formatGenres.test.js

import { expect, describe, it } from "vitest";
import { formatGenres } from "./helpers"

// formatGenres function
//    formatGenres('action,comedy') → string
//    would output: Action, Comedy
describe("formatGenres function", () => {
  it("should output as proper case", () => {
    const result = formatGenres("crime,drama")
    expect(result).toBe("Crime, Drama")
  })

  it("should handle long string", () => {
    const result = formatGenres("science-fiction,adventure,superhero,action,family,comedy")
    expect(result).toBe("Science-fiction, Adventure, Superhero, Action, Family, Comedy")
  })

  it("should handle mixed case", () => {
    const result = formatGenres("ACtiOn,adveNTURE,MYsTeRy,sCieNce-FIcTiOn,THRiLLeR")
    expect(result).toBe("Action, Adventure, Mystery, Science-fiction, Thriller")
  })
})


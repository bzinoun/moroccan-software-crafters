import { describe, expect, it } from "vitest";
import { EMPTY_VALUES } from "./funnel-fields";

describe("EMPTY_VALUES", () => {
  it("starts on the first city and the e-mail preference", () => {
    expect(EMPTY_VALUES).toMatchObject({
      formule: "",
      ville: "Casablanca",
      preference: "E-mail",
      equipements: [],
      consent: false,
    });
  });
});

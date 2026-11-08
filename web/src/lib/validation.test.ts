import { describe, expect, it } from "vitest";
import { isValidEmail, normalizePhone, validPhone } from "./validation";

describe("isValidEmail", () => {
  it.each(["sara@acme.ma", "a.b+tag@sub.example.com", "x@y.co"])(
    "accepts %s",
    (input) => {
      expect(isValidEmail(input)).toBe(true);
    },
  );

  it.each(["", "sara", "sara@acme", "sara@acme.m", "sa ra@acme.ma", "@a.ma"])(
    "rejects %j",
    (input) => {
      expect(isValidEmail(input)).toBe(false);
    },
  );

  it("does not trim: the caller trims", () => {
    expect(isValidEmail(" sara@acme.ma")).toBe(false);
  });
});

describe("phone", () => {
  it("removes spaces, dots, dashes and brackets", () => {
    expect(normalizePhone("06.12-34 56(78)")).toBe("0612345678");
  });

  it.each(["06 12 34 56 78", "07 12345678", "05.12.34.56.78"])(
    "accepts the Moroccan number %s",
    (input) => {
      expect(validPhone(input)).toBe(true);
    },
  );

  it.each(["+212 6 12 34 56 78", "00212612345678"])(
    "accepts the international number %s",
    (input) => {
      expect(validPhone(input)).toBe(true);
    },
  );

  it.each(["", "0612", "04 12 34 56 78", "+21261", "abc"])(
    "rejects %j",
    (input) => {
      expect(validPhone(input)).toBe(false);
    },
  );
});

import { describe, expect, it } from "vitest";
import { parseBasePath } from "./base-path";

describe("parseBasePath", () => {
  it("returns an empty string when the variable is unset", () => {
    expect(parseBasePath(undefined)).toBe("");
  });

  it("returns an empty string when the variable is empty", () => {
    expect(parseBasePath("")).toBe("");
  });

  it("returns a valid base path unchanged", () => {
    expect(parseBasePath("/moroccan-software-crafters")).toBe(
      "/moroccan-software-crafters",
    );
  });

  it("accepts a nested base path", () => {
    expect(parseBasePath("/a/b")).toBe("/a/b");
  });

  it("throws a clear error when the leading slash is missing", () => {
    expect(() => parseBasePath("moroccan-software-crafters")).toThrow(
      /NEXT_PUBLIC_BASE_PATH.*start with "\/"/,
    );
  });

  it("throws a clear error when a trailing slash is present", () => {
    expect(() => parseBasePath("/moroccan-software-crafters/")).toThrow(
      /NEXT_PUBLIC_BASE_PATH.*not end with "\/"/,
    );
  });

  it("rejects a lone slash", () => {
    expect(() => parseBasePath("/")).toThrow(/NEXT_PUBLIC_BASE_PATH/);
  });
});

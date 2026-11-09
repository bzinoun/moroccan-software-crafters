import { describe, expect, it } from "vitest";
import { withKeys } from "./keys";

const keysOf = (words: string[]) =>
  withKeys(words, (word) => word).map(({ key }) => key);

describe("withKeys", () => {
  it("keeps the plain key of an item that is alone", () => {
    expect(keysOf(["a", "b"])).toEqual(["a", "b"]);
  });

  it("numbers the repeats, so no key is used twice", () => {
    expect(keysOf(["a", "a", "a"])).toEqual(["a", "a#2", "a#3"]);
  });

  it("never reuses a key that an item already has", () => {
    const keys = keysOf(["a", "a#2", "a"]);
    expect(new Set(keys).size).toBe(3);
  });

  it("keeps each item next to its key, in order", () => {
    const rows = withKeys(
      [
        { year: "2022", title: "Spring" },
        { year: "2022", title: "Autumn" },
      ],
      (row) => row.year,
    );
    expect(rows.map(({ item }) => item.title)).toEqual(["Spring", "Autumn"]);
    expect(rows.map(({ key }) => key)).toEqual(["2022", "2022#2"]);
  });

  it("returns nothing for no item", () => {
    expect(withKeys([], () => "x")).toEqual([]);
  });
});

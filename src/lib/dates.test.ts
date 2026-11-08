import { describe, expect, it } from "vitest";
import { parseIsoDay, tomorrowIso } from "./dates";

describe("tomorrowIso", () => {
  it("returns the next local day as YYYY-MM-DD", () => {
    expect(tomorrowIso(new Date(2026, 10, 7, 23, 30))).toBe("2026-11-08");
  });

  it("crosses the end of the year", () => {
    expect(tomorrowIso(new Date(2026, 11, 31, 8, 0))).toBe("2027-01-01");
  });
});

describe("parseIsoDay", () => {
  it("gives the local day at noon, whatever the time zone", () => {
    const day = parseIsoDay("2026-11-07");
    expect(day?.getFullYear()).toBe(2026);
    expect(day?.getMonth()).toBe(10);
    expect(day?.getDate()).toBe(7);
    expect(day?.getHours()).toBe(12);
    expect(day?.getDay()).toBe(6);
  });

  it("accepts the last day of a leap February", () => {
    expect(parseIsoDay("2028-02-29")?.getDate()).toBe(29);
  });

  it.each([
    "",
    "2026-13-45",
    "2027-02-30",
    "2027-02-29",
    "9999-99-99",
    "2026-11-8",
    "2026-11-07T10:00",
    " 2026-11-07",
    "<b>x</b>",
  ])("rejects %j", (value) => {
    expect(parseIsoDay(value)).toBeNull();
  });
});

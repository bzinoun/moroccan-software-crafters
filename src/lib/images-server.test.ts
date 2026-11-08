import { describe, expect, it } from "vitest";
import { requireMeetupPhoto } from "./images-server";

describe("requireMeetupPhoto", () => {
  it("returns the name of a photo that has an image file", () => {
    expect(requireMeetupPhoto("2022-03-socrates-groupe")).toBe(
      "2022-03-socrates-groupe",
    );
  });

  it("throws, naming the photo, when the image file does not exist", () => {
    expect(() => requireMeetupPhoto("no-such-photo")).toThrow(/no-such-photo/);
  });
});

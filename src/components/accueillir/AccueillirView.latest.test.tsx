import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type * as ContentLoad from "@/content/load";

// A fixture of events: an upcoming meetup comes first in the file, and the
// last meetup that took place has one registration.
vi.mock("@/content/load", async (importOriginal) => {
  const actual = await importOriginal<typeof ContentLoad>();
  const real = actual.loadEvents()[0]!;
  return {
    ...actual,
    loadEvents: () => [
      {
        ...real,
        type: "meetup",
        date: "2026-12-12",
        host: "Futur Hôte",
        registrations: 80,
      },
      {
        ...real,
        type: "meetup",
        date: "2026-10-24",
        host: "Dernier Hôte",
        registrations: 1,
      },
    ],
  };
});

import AccueillirPage from "./page";

afterEach(() => {
  vi.useRealTimers();
});

describe("AccueillirPage proof card with an upcoming meetup in the file", () => {
  it("writes the last edition from the latest meetup that took place", () => {
    vi.useFakeTimers({
      toFake: ["Date"],
      now: new Date("2026-11-08T10:00:00Z"),
    });
    const { container } = render(<AccueillirPage />);
    const proof = container.querySelector("#proof-text");
    expect(proof).toHaveTextContent("Dernier Hôte");
    expect(proof).not.toHaveTextContent("Futur Hôte");
  });

  it("uses the singular for one registration", () => {
    vi.useFakeTimers({
      toFake: ["Date"],
      now: new Date("2026-11-08T10:00:00Z"),
    });
    const { container } = render(<AccueillirPage />);
    expect(container.querySelector("#proof-text")).toHaveTextContent(
      /1 inscrit\./,
    );
  });
});

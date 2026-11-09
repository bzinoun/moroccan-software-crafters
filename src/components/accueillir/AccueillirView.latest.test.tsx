import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadEvents, loadOffers, loadSite } from "@/content/load";
import { AccueillirView } from "./AccueillirView";

// A fixture of events: an upcoming meetup comes first in the file, and the
// last meetup that took place has one registration.
const real = loadEvents()[0]!;
const events = [
  {
    ...real,
    type: "meetup" as const,
    date: "2026-12-12",
    host: "Futur Hôte",
    registrations: 80,
  },
  {
    ...real,
    type: "meetup" as const,
    date: "2026-10-24",
    host: "Dernier Hôte",
    registrations: 1,
  },
];

function renderView() {
  return render(
    <AccueillirView
      offers={loadOffers()}
      events={events}
      site={loadSite()}
      today="2026-11-08"
    />,
  );
}

describe("AccueillirView proof card with an upcoming meetup in the file", () => {
  it("writes the last edition from the latest meetup that took place", () => {
    const { container } = renderView();
    const proof = container.querySelector("#proof-text");
    expect(proof).toHaveTextContent("Dernier Hôte");
    expect(proof).not.toHaveTextContent("Futur Hôte");
  });

  it("uses the singular for one registration", () => {
    const { container } = renderView();
    expect(container.querySelector("#proof-text")).toHaveTextContent(
      /1 inscrit\./,
    );
  });
});

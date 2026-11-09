import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  loadCompanies,
  loadEvents,
  loadSite,
  loadSocrates,
  loadSponsoring,
} from "@/content/load";
import { SocratesView } from "./SocratesView";

// The content of the page with its lists emptied: a section whose body is an
// empty list leaves no heading behind.
const real = loadSocrates();
const emptied = {
  ...real,
  editions: { ...real.editions, items: [] },
  family: { ...real.family, items: [] },
  schedule: { ...real.schedule, days: [] },
  openspace: {
    ...real.openspace,
    laws: [],
    formats: { ...real.openspace.formats, items: [] },
  },
};

function renderView() {
  return render(
    <SocratesView
      socrates={emptied}
      sponsoring={loadSponsoring()}
      companies={loadCompanies()}
      events={loadEvents()}
      site={loadSite()}
    />,
  );
}

describe("SocratesView with empty lists", () => {
  it("renders no section for a list that is empty", () => {
    const { container } = renderView();
    const ids = [...container.querySelectorAll("section[id]")].map(
      (el) => el.id,
    );
    expect(ids).not.toContain("regles");
    expect(ids).not.toContain("deroule");
    expect(ids).not.toContain("editions");
    expect(ids).not.toContain("famille");
    expect(ids).toContain("sponsoring");
  });

  it("leaves no empty container behind", () => {
    const { container } = renderView();
    expect(container.querySelector("#formats")).toBeNull();
  });
});

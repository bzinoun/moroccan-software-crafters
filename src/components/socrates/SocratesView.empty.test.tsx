import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type * as ContentLoad from "@/content/load";

// The content of the page with its lists emptied: a section whose body is an
// empty list leaves no heading behind.
vi.mock("@/content/load", async (importOriginal) => {
  const actual = await importOriginal<typeof ContentLoad>();
  const real = actual.loadSocrates();
  return {
    ...actual,
    loadSocrates: () => ({
      ...real,
      editions: { ...real.editions, items: [] },
      family: { ...real.family, items: [] },
      schedule: { ...real.schedule, days: [] },
      openspace: {
        ...real.openspace,
        laws: [],
        formats: { ...real.openspace.formats, items: [] },
      },
    }),
  };
});

import SocratesPage from "./page";

describe("SocratesPage with empty lists", () => {
  it("renders no section for a list that is empty", () => {
    const { container } = render(<SocratesPage />);
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
    const { container } = render(<SocratesPage />);
    expect(container.querySelector("#formats")).toBeNull();
  });
});

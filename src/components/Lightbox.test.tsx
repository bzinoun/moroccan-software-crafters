import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LightboxProvider, useLightbox, type LightboxItem } from "./Lightbox";

// jsdom has no showModal() or close() on HTMLDialogElement: stub them here.
// showModal is a spy so a test can tell it from show() (a non-modal open that
// has no top layer, no native Escape, no focus trap and no ::backdrop): show()
// throws, so code that falls back to it fails loudly.
// close() fires the "close" event like a browser does, which is what Escape,
// the close button and the backdrop click all end in.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function showModal(
    this: HTMLDialogElement,
  ) {
    this.setAttribute("open", "");
  });
  HTMLDialogElement.prototype.show = vi.fn(function show() {
    throw new Error("show() opens a non-modal dialog: use showModal()");
  });
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  document.body.style.overflow = "";
});

// Fixture photos; a caption has the gallery form "{title} · {date}".
const FOUR = [
  {
    src: "/assets/img/meetups/acme-1.jpg",
    caption: "Meetup @ Acme · 23 mai 2026",
  },
  {
    src: "/assets/img/meetups/acme-2.jpg",
    caption: "Meetup @ Acme · 23 mai 2026",
  },
  {
    src: "/assets/img/meetups/acme-3.jpg",
    caption: "Meetup @ Acme · 23 mai 2026",
  },
  {
    src: "/assets/img/meetups/acme-4.jpg",
    caption: "Meetup @ Acme · 23 mai 2026",
  },
];
const THREE = [
  {
    src: "/assets/img/meetups/beta-1.jpg",
    caption: "Meetup @ Beta · 28 mars 2026",
  },
  {
    src: "/assets/img/meetups/beta-2.jpg",
    caption: "Meetup @ Beta · 28 mars 2026 (2)",
  },
  { src: "/assets/img/meetups/beta-3.jpg" },
];
const SINGLE = [
  {
    src: "/assets/img/meetups/2022-03-socrates-groupe.jpg",
    caption: "SoCraTes Maroc 2022 · 1re édition",
  },
];

function Opener({
  items,
  start = 0,
  label = "Ouvrir",
}: {
  items: LightboxItem[];
  start?: number;
  label?: string;
}) {
  const lightbox = useLightbox();
  return (
    <button type="button" onClick={() => lightbox.open(items, start)}>
      {label}
    </button>
  );
}

function setup(items: LightboxItem[] = FOUR, start = 0) {
  const user = userEvent.setup();
  render(
    <LightboxProvider>
      <Opener items={items} start={start} />
    </LightboxProvider>,
  );
  return user;
}

// A closed dialog is not in the accessibility tree, so look it up by tag.
function dialog() {
  return document.querySelector("dialog") as HTMLDialogElement;
}

describe("LightboxProvider", () => {
  it("renders its children and keeps the dialog closed", () => {
    setup();
    expect(screen.getByRole("button", { name: "Ouvrir" })).toBeInTheDocument();
    expect(dialog()).not.toHaveAttribute("open");
  });

  it("opens as a modal dialog on the item at the start index", async () => {
    const user = setup(FOUR, 2);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(dialog()).toHaveAttribute("open");
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    expect(HTMLDialogElement.prototype.show).not.toHaveBeenCalled();
    const photo = screen.getByRole("img", {
      name: "Meetup @ Acme · 23 mai 2026",
    });
    expect(photo).toHaveAttribute("src", "/assets/img/meetups/acme-3.jpg");
    expect(photo).toHaveAttribute("loading", "lazy");
  });

  it("names the open dialog Photo agrandie", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(
      screen.getByRole("dialog", { name: "Photo agrandie" }),
    ).toBeInTheDocument();
  });

  it("shows the caption and a counter when there are several photos", async () => {
    const user = setup(FOUR, 2);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(
      screen.getByText("Meetup @ Acme · 23 mai 2026 · 3 / 4"),
    ).toBeInTheDocument();
  });

  it("shows the counter alone when the photo has no caption", async () => {
    const user = setup(THREE, 2);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    // Empty alt makes the photo presentational, so look it up by tag.
    expect(dialog().querySelector("img")).toHaveAttribute("alt", "");
  });

  it("shows only the caption, with no counter and no step buttons, for a single photo", async () => {
    const user = setup(SINGLE);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(
      screen.getByText("SoCraTes Maroc 2022 · 1re édition"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Photo précédente" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Photo suivante" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fermer" })).toBeInTheDocument();
  });

  it("does nothing when it is opened with an empty list", async () => {
    const user = setup([]);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(dialog()).not.toHaveAttribute("open");
    expect(document.body.style.overflow).toBe("");
  });

  it("clamps a start index outside the list to the nearest end", async () => {
    const user = setup(FOUR, 99);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(screen.getByText(/· 4 \/ 4$/)).toBeInTheDocument();
    expect(dialog().querySelector("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/acme-4.jpg",
    );
    await user.click(screen.getByRole("button", { name: "Fermer" }));
  });

  it("clamps a negative start index to the first photo", async () => {
    const user = setup(FOUR, -3);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(screen.getByText(/· 1 \/ 4$/)).toBeInTheDocument();
    expect(dialog().querySelector("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/acme-1.jpg",
    );
  });

  it("puts a narrow no-break space before a colon in the caption", async () => {
    const user = setup([{ src: "/a.jpg", caption: "Atelier : TDD" }]);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    // getByText would collapse U+202F to a plain space, so compare the raw text.
    expect(dialog().querySelector("figcaption")?.textContent).toBe(
      "Atelier\u202f: TDD",
    );
  });
});

describe("stepping", () => {
  it("steps to the next and previous photo with the buttons", async () => {
    const user = setup(FOUR, 0);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.click(screen.getByRole("button", { name: "Photo suivante" }));
    expect(dialog().querySelector("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/acme-2.jpg",
    );
    expect(screen.getByText(/· 2 \/ 4$/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Photo précédente" }));
    expect(screen.getByText(/· 1 \/ 4$/)).toBeInTheDocument();
  });

  it("wraps around at both ends", async () => {
    const user = setup(FOUR, 0);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.click(screen.getByRole("button", { name: "Photo précédente" }));
    expect(screen.getByText(/· 4 \/ 4$/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Photo suivante" }));
    expect(screen.getByText(/· 1 \/ 4$/)).toBeInTheDocument();
  });

  it("steps with ArrowRight and ArrowLeft", async () => {
    const user = setup(FOUR, 0);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText(/· 2 \/ 4$/)).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByText(/· 4 \/ 4$/)).toBeInTheDocument();
  });

  it("keeps stepping with the arrow keys after a click on the photo moved focus to the page", async () => {
    const user = setup(FOUR, 0);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.click(dialog().querySelector("img") as HTMLElement);
    expect(dialog()).toHaveAttribute("open");
    expect(document.body).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText(/· 2 \/ 4$/)).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByText(/· 1 \/ 4$/)).toBeInTheDocument();
  });

  it("ignores the arrow keys once the lightbox is closed", async () => {
    const user = setup(FOUR, 0);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.click(screen.getByRole("button", { name: "Fermer" }));
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(screen.getByText(/· 1 \/ 4$/)).toBeInTheDocument();
  });

  it("starts again from the new start index when it is reopened", async () => {
    const user = setup(FOUR, 1);
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.click(screen.getByRole("button", { name: "Photo suivante" }));
    await user.click(screen.getByRole("button", { name: "Fermer" }));
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(screen.getByText(/· 2 \/ 4$/)).toBeInTheDocument();
  });
});

describe("closing", () => {
  it("closes with the close button", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.click(screen.getByRole("button", { name: "Fermer" }));
    expect(dialog()).not.toHaveAttribute("open");
  });

  it("closes on a click on the backdrop, not on the photo", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    await user.click(dialog().querySelector("img") as HTMLElement);
    expect(dialog()).toHaveAttribute("open");
    await user.click(dialog());
    expect(dialog()).not.toHaveAttribute("open");
  });

  it("cleans up when the browser closes the dialog itself (Escape)", async () => {
    const user = setup();
    const opener = screen.getByRole("button", { name: "Ouvrir" });
    await user.click(opener);
    expect(document.body.style.overflow).toBe("hidden");
    act(() => dialog().close());
    expect(document.body.style.overflow).toBe("");
    expect(opener).toHaveFocus();
  });
});

describe("focus and scroll", () => {
  it("moves focus to the close button on open and back to the opener on close", async () => {
    const user = setup();
    const opener = screen.getByRole("button", { name: "Ouvrir" });
    await user.click(opener);
    expect(screen.getByRole("button", { name: "Fermer" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Fermer" }));
    expect(opener).toHaveFocus();
  });

  it("returns focus to the opener that was used when there are several", async () => {
    const user = userEvent.setup();
    render(
      <LightboxProvider>
        <Opener items={FOUR} label="Premier" />
        <Opener items={THREE} label="Second" />
      </LightboxProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Second" }));
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Fermer" }));
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
  });

  it("opens the dialog once when open() runs again while it is open, and keeps the first opener", async () => {
    const user = userEvent.setup();
    render(
      <LightboxProvider>
        <Opener items={FOUR} label="Premier" />
        <Opener items={THREE} label="Second" />
      </LightboxProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Premier" }));
    await user.click(screen.getByRole("button", { name: "Second" }));
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    // The second call replaced the photos.
    expect(screen.getByText(/· 1 \/ 3$/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Fermer" }));
    expect(screen.getByRole("button", { name: "Premier" })).toHaveFocus();
  });

  it("locks the body scroll while open and restores it on close", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(document.body.style.overflow).toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Fermer" }));
    expect(document.body.style.overflow).toBe("");
  });
});

describe("useLightbox", () => {
  it("throws a clear error outside the provider", () => {
    // React logs the thrown error: keep the test output quiet.
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    try {
      expect(() => render(<Opener items={FOUR} />)).toThrow(
        "useLightbox must be used inside LightboxProvider",
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});

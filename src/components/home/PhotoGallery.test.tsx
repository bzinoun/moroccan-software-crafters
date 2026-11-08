import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { LightboxProvider } from "../Lightbox";
import { PhotoGallery } from "./PhotoGallery";

// jsdom has no showModal() or close() on HTMLDialogElement: stub them here.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  document.body.style.overflow = "";
});

// Real photos of content/events.json, newest event first, as galleryItems()
// returns them: 8 + 4 + 3 + 2 = 17 photos. The caption is "{title} · {date}".
const SG = "Meetup @ Société Générale GSCM · 24 oct. 2026";
const AXA = "Meetup @ AXA Assurance Maroc · 23 mai 2026";
const INNOVX = "Meetup @ InnovX · 28 mars 2026";
const SOCRATES = "SoCraTes Maroc 2022 · 1re édition · 25 mars 2022";

function photo(name: string, caption: string) {
  return {
    photo: name,
    src: `/assets/img/meetups/${name}.jpg`,
    caption,
    eventId: name.replace(/-(\d+|groupe|open-space)$/, ""),
  };
}

const ITEMS = [
  ...[5, 3, 2, 7, 8, 4, 6, 1].map((n) => photo(`2026-10-sg-gscm-${n}`, SG)),
  ...[1, 2, 3, 4].map((n) => photo(`2026-05-axa-${n}`, AXA)),
  ...[1, 2, 3].map((n) => photo(`2026-03-innovx-${n}`, INNOVX)),
  photo("2022-03-socrates-groupe", SOCRATES),
  photo("2022-03-socrates-open-space", SOCRATES),
];

// content/home.json, gallery.
const COPY = {
  eyebrow: "Galerie",
  title: "Dans la salle.",
  more: "Voir toutes les photos",
};

function setup(props: Partial<Parameters<typeof PhotoGallery>[0]> = {}) {
  render(
    <LightboxProvider>
      <PhotoGallery {...COPY} limit={8} items={ITEMS} {...props} />
    </LightboxProvider>,
  );
}

function openers() {
  return screen.getAllByRole("button", { name: /^Agrandir : / });
}

function moreButton() {
  return screen.queryByRole("button", { name: COPY.more });
}

describe("PhotoGallery", () => {
  it("is the galerie section with its eyebrow and title", () => {
    setup();
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Dans la salle.",
    });
    expect(screen.getByText("Galerie")).toBeInTheDocument();
    expect(heading.closest("section")).toHaveAttribute("id", "galerie");
  });

  it("shows the first 8 photos, each a button named after its caption", () => {
    setup();
    const buttons = openers();
    expect(buttons).toHaveLength(8);
    expect(buttons[0]).toHaveAccessibleName(`Agrandir : ${SG}`);
    const img = within(buttons[0]).getByRole("img", { name: SG });
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
    );
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("uses 8 when the limit is 0 or missing, as the old site did", () => {
    setup({ limit: 0 });
    expect(openers()).toHaveLength(8);
  });

  it("honors a smaller limit", () => {
    setup({ limit: 3 });
    expect(openers()).toHaveLength(3);
  });

  it("offers a more button wired to the grid while photos are hidden", () => {
    setup();
    const more = moreButton();
    expect(more).toHaveAttribute("aria-expanded", "false");
    const grid = document.getElementById(
      more?.getAttribute("aria-controls") ?? "missing",
    );
    expect(grid).toContainElement(openers()[0]);
  });

  it("has no more button when every photo already shows", () => {
    setup({ items: ITEMS.slice(0, 8) });
    expect(openers()).toHaveLength(8);
    expect(moreButton()).not.toBeInTheDocument();
  });

  it("appends the other 9 photos, drops the button and focuses the 9th", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(moreButton()!);
    const buttons = openers();
    expect(buttons).toHaveLength(17);
    expect(buttons[8]).toHaveAccessibleName(`Agrandir : ${AXA}`);
    expect(buttons[8]).toHaveFocus();
    expect(moreButton()).not.toBeInTheDocument();
  });

  it("opens the lightbox on the clicked photo, among all 17", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(openers()[2]);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-2.jpg",
    );
    expect(dialog).toHaveTextContent(`${SG} · 3 / 17`);
  });

  it("opens the lightbox on an appended photo with its real index", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(moreButton()!);
    await user.click(openers()[16]);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveTextContent(`${SOCRATES} · 17 / 17`);
  });

  it("walks the hidden photos from the lightbox before the more button", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(openers()[7]);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    await user.click(within(dialog).getByRole("button", { name: /suiv/i }));
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-05-axa-1.jpg",
    );
  });

  describe("layout guards", () => {
    it("lays the photos in 2, 3 then 4 columns, mobile first", () => {
      setup();
      const grid = document.getElementById(
        moreButton()?.getAttribute("aria-controls") ?? "missing",
      );
      const classes = grid?.className.split(" ");
      expect(classes).toEqual(
        expect.arrayContaining(["columns-2", "md:columns-3", "lg:columns-4"]),
      );
    });

    it("zooms the photo on hover only behind motion-safe", () => {
      setup();
      const img = within(openers()[0]).getByRole("img");
      const classes = img.className.split(" ");
      expect(classes).toContain("motion-safe:group-hover:scale-103");
      expect(classes.filter((c) => /(^|:)scale-/.test(c))).toEqual([
        "motion-safe:group-hover:scale-103",
      ]);
    });

    it("shows the caption overlay on hover and on keyboard focus", () => {
      setup();
      const overlay = within(openers()[0]).getByText(SG);
      const classes = overlay.className.split(" ");
      expect(classes).toContain("opacity-0");
      expect(classes).toContain("group-hover:opacity-100");
      expect(classes).toContain("group-focus-visible:opacity-100");
    });
  });
});

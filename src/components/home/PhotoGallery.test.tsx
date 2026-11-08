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

// A fixture written here, newest event first, as galleryItems() returns the
// photos. The caption is "{title} · {date}".
const ACME = "Meetup @ Acme Corp · 24 oct. 2026";
const GLOBEX = "Meetup @ Globex · 23 mai 2026";
const INITECH = "Meetup @ Initech · 28 mars 2026";
const OLD = "Édition 2022 · 25 mars 2022";

function photo(name: string, caption: string) {
  return {
    photo: name,
    src: `/assets/img/meetups/${name}.jpg`,
    caption,
    eventId: name.replace(/-(\d+|groupe|open-space)$/, ""),
  };
}

const ITEMS = [
  ...[5, 3, 2, 7, 8, 4, 6, 1].map((n) => photo(`2026-10-acme-${n}`, ACME)),
  ...[1, 2, 3, 4].map((n) => photo(`2026-05-globex-${n}`, GLOBEX)),
  ...[1, 2, 3].map((n) => photo(`2026-03-initech-${n}`, INITECH)),
  photo("2022-03-old-groupe", OLD),
  photo("2022-03-old-open-space", OLD),
];
const TOTAL = ITEMS.length;
const LIMIT = 8;

const COPY = {
  eyebrow: "Galerie",
  title: "Dans la salle.",
  more: "Voir toutes les photos",
};

function setup(props: Partial<Parameters<typeof PhotoGallery>[0]> = {}) {
  render(
    <LightboxProvider>
      <PhotoGallery {...COPY} limit={LIMIT} items={ITEMS} {...props} />
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

  it("shows the first photos up to the limit, each a button named after its caption", () => {
    setup();
    const buttons = openers();
    expect(buttons).toHaveLength(LIMIT);
    expect(buttons[0]).toHaveAccessibleName(`Agrandir : ${ACME}`);
    const img = within(buttons[0]!).getByRole("img", { name: ACME });
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-acme-5.jpg",
    );
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("uses 8 when the limit is 0 or missing, as the old site did", () => {
    setup({ limit: 0 });
    expect(openers()).toHaveLength(8);
    expect(TOTAL).toBeGreaterThan(8);
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
    expect(grid).toContainElement(openers()[0]!);
  });

  it("has no more button when every photo already shows", () => {
    setup({ items: ITEMS.slice(0, LIMIT) });
    expect(openers()).toHaveLength(LIMIT);
    expect(moreButton()).not.toBeInTheDocument();
  });

  it("appends the other photos, drops the button and focuses the first new one", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(moreButton()!);
    const buttons = openers();
    expect(buttons).toHaveLength(TOTAL);
    expect(buttons[LIMIT]).toHaveAccessibleName(`Agrandir : ${GLOBEX}`);
    expect(buttons[LIMIT]).toHaveFocus();
    expect(moreButton()).not.toBeInTheDocument();
  });

  it("opens the lightbox on the clicked photo, among all the photos", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(openers()[2]!);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-acme-2.jpg",
    );
    expect(dialog).toHaveTextContent(`${ACME} · 3 / ${TOTAL}`);
  });

  it("opens the lightbox on an appended photo with its real index", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(moreButton()!);
    await user.click(openers()[TOTAL - 1]!);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog).toHaveTextContent(`${OLD} · ${TOTAL} / ${TOTAL}`);
  });

  it("walks the hidden photos from the lightbox before the more button", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(openers()[LIMIT - 1]!);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    await user.click(within(dialog).getByRole("button", { name: /suiv/i }));
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-05-globex-1.jpg",
    );
  });

  describe("layout guards", () => {
    it("zooms the photo on hover only behind motion-safe", () => {
      setup();
      const img = within(openers()[0]!).getByRole("img");
      const classes = img.className.split(" ");
      expect(classes.filter((c) => /(^|:)scale-/.test(c))).toEqual([
        "motion-safe:group-hover:scale-103",
      ]);
    });
  });
});

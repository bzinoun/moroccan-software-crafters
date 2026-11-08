import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_GALLERY_LIMIT } from "@/lib/home-data";
import { inMemoryModalDialog } from "@/test/in-memory-modal-dialog";
import { renderWithPorts } from "@/test/ports";
import { LightboxProvider } from "../Lightbox";
import { setJs } from "./js-mode";
import { PhotoGallery } from "./PhotoGallery";

// jsdom has no showModal() or close(): the in-memory ModalDialog port stands in.
let modal = inMemoryModalDialog();
beforeEach(() => {
  modal = inMemoryModalDialog();
  document.body.style.overflow = "";
  setJs(true);
});

afterEach(() => {
  setJs(false);
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
  renderWithPorts(
    <LightboxProvider>
      <PhotoGallery {...COPY} limit={LIMIT} items={ITEMS} {...props} />
    </LightboxProvider>,
    { modalDialog: modal },
  );
}

function openers() {
  return screen.getAllByRole("link", { name: /^Agrandir : / });
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

  it("shows the first photos up to the limit, each a link named after its caption", () => {
    setup();
    const links = openers();
    expect(links).toHaveLength(LIMIT);
    expect(links[0]).toHaveAccessibleName(`Agrandir : ${ACME}, photo 1 sur 8`);
    const img = within(links[0]!).getByRole("img", { name: ACME });
    expect(img).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-acme-5.jpg",
    );
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("tells the photos of one event apart by their position in that event", () => {
    setup({ items: ITEMS.slice(0, 8) });
    const names = openers().map((link) => link.getAttribute("aria-label"));
    expect(new Set(names).size).toBe(8);
    expect(names[2]).toBe(`Agrandir : ${ACME}, photo 3 sur 8`);
    expect(names[7]).toBe(`Agrandir : ${ACME}, photo 8 sur 8`);
  });

  it("uses the default limit when the limit is 0 or missing", () => {
    setup({ limit: 0 });
    expect(openers()).toHaveLength(DEFAULT_GALLERY_LIMIT);
    expect(TOTAL).toBeGreaterThan(DEFAULT_GALLERY_LIMIT);
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
    const links = openers();
    expect(links).toHaveLength(TOTAL);
    expect(links[LIMIT]).toHaveAccessibleName(
      `Agrandir : ${GLOBEX}, photo 1 sur 4`,
    );
    expect(links[LIMIT]).toHaveFocus();
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

  it("links each photo to its file", () => {
    setup();
    expect(openers()[0]).toHaveAttribute(
      "href",
      "/assets/img/meetups/2026-10-acme-5.jpg",
    );
  });

  it("keeps every photo in the page, and hides the extra ones from a visitor with JavaScript", () => {
    setup();
    expect(openers()).toHaveLength(LIMIT);
    expect(document.querySelectorAll("a[href^='/assets/']")).toHaveLength(
      TOTAL,
    );
  });

  it("shows every photo and no more button without JavaScript", () => {
    setJs(false);
    setup();
    expect(openers()).toHaveLength(TOTAL);
    expect(moreButton()).not.toBeInTheDocument();
  });

  it("keeps the click on a photo from navigating to the file", () => {
    setup();
    expect(fireEvent.click(openers()[0]!)).toBe(false);
    expect(document.querySelector("dialog")).toHaveAttribute("open");
  });

  it("gives the focus back to the photo link when the lightbox closes", () => {
    setup();
    const link = openers()[1]!;
    fireEvent.click(link);
    modal.close(document.querySelector("dialog") as HTMLDialogElement);
    expect(link).toHaveFocus();
  });

  it("renders nothing when there is no photo", () => {
    const { container } = renderWithPorts(
      <LightboxProvider>
        <PhotoGallery {...COPY} limit={LIMIT} items={[]} />
      </LightboxProvider>,
      { modalDialog: modal },
    );
    expect(container.querySelector("section")).toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
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

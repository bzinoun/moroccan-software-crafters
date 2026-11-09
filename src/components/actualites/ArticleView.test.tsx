import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { ArticleView as ArticleViewData } from "@/lib/pages-data";
import { inMemoryModalDialog } from "@/test/in-memory-modal-dialog";
import { renderWithPorts } from "@/test/ports";
import { LightboxProvider } from "../Lightbox";
import { ArticleView } from "./ArticleView";

// jsdom has no showModal() or close(): the in-memory ModalDialog port stands in.
let modal = inMemoryModalDialog();
beforeEach(() => {
  modal = inMemoryModalDialog();
  document.body.style.overflow = "";
});

const RECAP: ArticleViewData = {
  slug: "recap-one",
  kind: "Récap",
  title: "Who is responsible when AI writes the code?",
  excerpt: "A hundred crafters and one question at the center.",
  dateLabel: "24 octobre 2026",
  coverSrc: "/assets/img/test-cover.jpg",
  tags: ["AI", "Responsibility"],
  body: "First paragraph of the recap.\n\n## Speed is a multiplier\n\nAI ships faster.",
  documentTitle: "Who is responsible · Test site",
  eventLinks: [
    { label: "Le post LinkedIn", href: "https://example.com/post" },
    { label: "La page Luma", href: "https://example.com/luma" },
  ],
  photos: [
    {
      photo: "test-1",
      src: "/assets/img/test-1.jpg",
      caption: "Test meetup · 24 oct. 2026",
      eventId: "2026-10-test",
    },
    {
      photo: "test-2",
      src: "/assets/img/test-2.jpg",
      caption: "Test meetup · 24 oct. 2026",
      eventId: "2026-10-test",
    },
  ],
  photosLabel: "Les 2 photos",
};

const ANNOUNCE: ArticleViewData = {
  ...RECAP,
  slug: "call",
  kind: "Annonce",
  title: "Fifth edition: the call for partners",
  coverSrc: null,
  eventLinks: [],
  photos: [],
  photosLabel: null,
};

function renderView(view: ArticleViewData) {
  return renderWithPorts(
    <LightboxProvider>
      <ArticleView view={view} />
    </LightboxProvider>,
    { modalDialog: modal },
  );
}

describe("ArticleView", () => {
  it("links back to the list", () => {
    renderView(RECAP);
    expect(
      screen.getByRole("link", { name: "← Toutes les actualités" }),
    ).toHaveAttribute("href", "/actualites/");
  });

  it("shows the title as the page heading with the kind, date and lead", () => {
    renderView(RECAP);
    expect(
      screen.getByRole("heading", { level: 1, name: RECAP.title }),
    ).toBeInTheDocument();
    const article = screen.getByRole("article");
    expect(within(article).getByText("Récap")).toBeInTheDocument();
    expect(within(article).getByText(/24 octobre 2026/)).toBeInTheDocument();
    expect(within(article).getByText(RECAP.excerpt)).toBeInTheDocument();
  });

  it("is a section named by the article title", () => {
    const { container } = renderView(RECAP);
    expect(screen.getByRole("region", { name: RECAP.title })).toBe(
      container.querySelector("section"),
    );
  });

  it("shows the cover as a decorative image", () => {
    const { container } = renderView(RECAP);
    const cover = container.querySelector("article img");
    expect(cover).toHaveAttribute("src", RECAP.coverSrc);
    expect(cover).toHaveAttribute("alt", "");
  });

  it("shows no cover for an article without one", () => {
    const { container } = renderView(ANNOUNCE);
    expect(container.querySelector("article img")).toBeNull();
  });

  it("renders the body through the Markdown subset", () => {
    renderView(RECAP);
    expect(
      screen.getByRole("heading", { level: 2, name: "Speed is a multiplier" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("First paragraph of the recap."),
    ).toBeInTheDocument();
  });

  it("lists the tags", () => {
    renderView(RECAP);
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(
      RECAP.tags,
    );
  });

  it("links to each event page in a new tab", () => {
    renderView(RECAP);
    for (const { label, href } of RECAP.eventLinks) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener");
    }
  });

  it("opens the photos of the event in the lightbox", async () => {
    renderView(RECAP);
    await userEvent.click(screen.getByRole("link", { name: "Les 2 photos" }));
    const dialog = screen.getByRole("dialog", { name: "Photo agrandie" });
    expect(dialog).toHaveAttribute("open");
    expect(
      within(dialog).getByRole("img", { name: /Test meetup/ }),
    ).toHaveAttribute("src", RECAP.photos[0]!.src);
  });

  it("shows no links row for an article without an event", () => {
    renderView(ANNOUNCE);
    expect(
      screen.getByRole("heading", { level: 1, name: ANNOUNCE.title }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Le post LinkedIn" })).toBeNull();
    expect(screen.queryByRole("link", { name: /photos/ })).toBeNull();
  });
});

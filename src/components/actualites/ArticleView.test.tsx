import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { loadArticles, loadEvents, loadSite } from "@/content/load";
import { articleBySlug, articleView } from "@/lib/pages-data";
import { LightboxProvider } from "../Lightbox";
import { ArticleView } from "./ArticleView";

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

function viewOf(slug: string) {
  const article = articleBySlug(slug, loadArticles());
  if (!article) throw new Error(`no article ${slug}`);
  return articleView(article, loadEvents(), loadSite());
}

function renderView(slug: string) {
  return render(
    <LightboxProvider>
      <ArticleView view={viewOf(slug)} />
    </LightboxProvider>,
  );
}

const RECAP = "sg-gscm-qui-est-responsable-quand-l-ia-ecrit-le-code";
const ANNOUNCE = "appel-partenaires-socrates-5e-edition";

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
      screen.getByRole("heading", {
        level: 1,
        name: "Qui est responsable quand l'IA écrit le code ?",
      }),
    ).toBeInTheDocument();
    const article = screen.getByRole("article");
    expect(within(article).getByText("Récap")).toBeInTheDocument();
    expect(within(article).getByText(/24 octobre 2026/)).toBeInTheDocument();
    expect(
      within(article).getByText(/110 inscrits et une question au centre/),
    ).toBeInTheDocument();
  });

  it("shows the cover as a decorative image", () => {
    const { container } = renderView(RECAP);
    const cover = container.querySelector("article img");
    expect(cover).toHaveAttribute(
      "src",
      "/assets/img/meetups/2026-10-sg-gscm-5.jpg",
    );
    expect(cover).toHaveAttribute("alt", "");
  });

  it("renders the body through the Markdown subset", () => {
    renderView(RECAP);
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "La vitesse est un multiplicateur",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ce samedi, les Moroccan Software Crafters/),
    ).toBeInTheDocument();
  });

  it("lists the tags", () => {
    renderView(RECAP);
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(
      ["IA", "Responsabilité", "Sécurité"],
    );
  });

  it("links to the LinkedIn post and the Luma page of the event in a new tab", () => {
    renderView(RECAP);
    const linkedin = screen.getByRole("link", { name: "Le post LinkedIn" });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/feed/update/urn:li:activity:7517872453725888512/",
    );
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener");
    expect(screen.getByRole("link", { name: "La page Luma" })).toHaveAttribute(
      "href",
      "https://luma.com/6eiyisjw",
    );
  });

  it("opens the photos of the event in the lightbox", async () => {
    renderView(RECAP);
    const open = screen.getByRole("button", { name: "Les 8 photos" });
    await userEvent.click(open);
    const dialog = screen.getByRole("dialog", { name: "Photo agrandie" });
    expect(dialog).toHaveAttribute("open");
    expect(
      within(dialog).getByRole("img", { name: /Société Générale GSCM/ }),
    ).toHaveAttribute("src", "/assets/img/meetups/2026-10-sg-gscm-5.jpg");
  });

  it("shows no links row for an article without an event", () => {
    renderView(ANNOUNCE);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "SoCraTes Maroc, 5e édition",
    );
    expect(screen.queryByRole("link", { name: "Le post LinkedIn" })).toBeNull();
    expect(screen.queryByRole("button", { name: /photos/ })).toBeNull();
  });

  // The old `[data-page="news"] main > .section:first-child` rule drew the
  // zellige corner on the article page too.
  it("draws the zellige corner on its section", () => {
    const { container } = renderView(RECAP);
    expect(container.querySelector("section")).toHaveClass("zellige-corner");
  });
});

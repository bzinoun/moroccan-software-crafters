import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ArticlePage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "./page";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
});

const SLUG = "axa-craftsmanship-a-l-ere-de-l-ia";

describe("/actualites/[slug]/ page", () => {
  it("builds one static page per article of content/articles.json", () => {
    expect(generateStaticParams()).toEqual([
      { slug: "appel-partenaires-socrates-5e-edition" },
      { slug: "sg-gscm-qui-est-responsable-quand-l-ia-ecrit-le-code" },
      { slug: "axa-craftsmanship-a-l-ere-de-l-ia" },
      { slug: "innovx-l-impact-reel-de-l-ia" },
    ]);
  });

  it("refuses slugs that were not generated", () => {
    expect(dynamicParams).toBe(false);
  });

  it("sets the document title and description from the article", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: SLUG }),
    });
    expect(metadata.title).toBe(
      "Craftsmanship à l'ère de l'IA : toute la stack passée en revue · Moroccan Software Crafters",
    );
    expect(metadata.description).toMatch(/^Chez AXA Assurance Maroc/);
  });

  it("shares the cover of the article with an absolute URL", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: SLUG }),
    });
    expect(metadata.openGraph?.images).toEqual([
      "https://bzinoun.github.io/moroccan-software-crafters/assets/img/meetups/2026-05-axa-1.jpg",
    ]);
    expect(metadata.openGraph?.url).toBe(
      "https://bzinoun.github.io/moroccan-software-crafters/actualites/axa-craftsmanship-a-l-ere-de-l-ia/",
    );
  });

  it("renders the article of the slug", async () => {
    render(await ArticlePage({ params: Promise.resolve({ slug: SLUG }) }));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Craftsmanship à l'ère de l'IA : toute la stack passée en revue",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "← Toutes les actualités" }),
    ).toHaveAttribute("href", "/actualites/");
  });
});

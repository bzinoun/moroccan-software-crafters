import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadArticles, loadEvents, loadSite } from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import ArticlePage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "./page";

const site = loadSite();
const { items } = loadArticles();
// An article with a cover, so the share image can be checked.
const article = items.find((a) => a.cover) ?? items[0]!;
const params = () => ({ params: Promise.resolve({ slug: article.slug }) });

describe("/actualites/[slug]/ page", () => {
  it("builds one static page per article of content/articles.json", () => {
    expect(generateStaticParams()).toEqual(
      items.map((a) => ({ slug: a.slug })),
    );
  });

  it("refuses slugs that were not generated", () => {
    expect(dynamicParams).toBe(false);
  });

  it("sets the document title and description from the article", async () => {
    const metadata = await generateMetadata(params());
    expect(metadata.title).toBe(`${article.title} · ${site.name}`);
    expect(metadata.description).toBe(article.excerpt);
  });

  it("shares the cover of the article with an absolute URL", async () => {
    const metadata = await generateMetadata(params());
    expect(metadata.openGraph?.images).toEqual([
      `${site.baseUrl}/assets/img/meetups/${article.cover}.jpg`,
    ]);
    expect(metadata.openGraph?.url).toBe(
      `${site.baseUrl}/actualites/${article.slug}/`,
    );
  });

  it("renders the lightbox only for an article that has photos", async () => {
    const events = loadEvents();
    const hasPhotos = (a: (typeof items)[number]) =>
      Boolean(events.find((e) => e.id === a.event)?.photos?.length);
    const withPhotos = items.find(hasPhotos);
    const without = items.find((a) => !hasPhotos(a));
    expect(withPhotos).toBeDefined();
    expect(without).toBeDefined();
    const dialogs = async (slug: string) => {
      const { container } = render(
        await ArticlePage({ params: Promise.resolve({ slug }) }),
      );
      return container.querySelectorAll("dialog").length;
    };
    expect(await dialogs(without!.slug)).toBe(0);
    expect(await dialogs(withPhotos!.slug)).toBe(1);
  });

  it("renders the article of the slug", async () => {
    render(await ArticlePage(params()));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: frenchSpacing(article.title),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "← Toutes les actualités" }),
    ).toHaveAttribute("href", "/actualites/");
  });
});

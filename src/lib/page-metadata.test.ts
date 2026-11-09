import { describe, expect, it } from "vitest";
import { pageMetadata } from "./page-metadata";

const BASE = "https://example.org/base";
const PHOTO = "2022-03-socrates-groupe";

describe("pageMetadata", () => {
  const meta = pageMetadata({
    baseUrl: BASE,
    path: "/meetup/",
    title: "Le meetup",
    description: "Le déroulé.",
    photo: PHOTO,
  });

  it("sets the document title and description", () => {
    expect(meta.title).toBe("Le meetup");
    expect(meta.description).toBe("Le déroulé.");
  });

  it("builds the canonical URL from the base URL and the path", () => {
    expect(meta.alternates?.canonical).toBe(`${BASE}/meetup/`);
    expect(meta.openGraph).toMatchObject({ url: `${BASE}/meetup/` });
  });

  it("shares the photo with an absolute URL in Open Graph and Twitter", () => {
    const image = `${BASE}/assets/img/meetups/${PHOTO}.jpg`;
    expect(meta.openGraph).toMatchObject({
      type: "website",
      title: "Le meetup",
      description: "Le déroulé.",
      images: [image],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Le meetup",
      description: "Le déroulé.",
      images: [image],
    });
  });

  it("uses the share title and description for the social tags only", () => {
    const shared = pageMetadata({
      baseUrl: BASE,
      path: "/meetup/",
      title: "Le meetup",
      description: "Pour les moteurs de recherche.",
      share: { title: "Un samedi matin", description: "Pour les réseaux." },
      photo: PHOTO,
    });
    expect(shared.title).toBe("Le meetup");
    expect(shared.description).toBe("Pour les moteurs de recherche.");
    expect(shared.openGraph).toMatchObject({
      title: "Un samedi matin",
      description: "Pour les réseaux.",
    });
    expect(shared.twitter).toMatchObject({
      title: "Un samedi matin",
      description: "Pour les réseaux.",
    });
  });

  it("marks an article page as an article", () => {
    const article = pageMetadata({
      baseUrl: BASE,
      path: "/actualites/recap/",
      title: "Récap",
      description: "Texte.",
      photo: PHOTO,
      type: "article",
    });
    expect(article.openGraph).toMatchObject({ type: "article" });
  });

  it("fails, naming the photo, when the image file does not exist", () => {
    expect(() =>
      pageMetadata({
        baseUrl: BASE,
        path: "/x/",
        title: "X",
        description: "X",
        photo: "no-such-photo",
      }),
    ).toThrow(/no-such-photo/);
  });
});

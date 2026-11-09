import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { loadHome, loadSite } from "@/content/load";
import RootLayout, { metadata } from "./layout";

const site = loadSite();
const home = loadHome();

function renderLayout(): Document {
  const html = renderToString(
    <RootLayout params={Promise.resolve({})}>
      <p>Contenu</p>
    </RootLayout>,
  );
  return new DOMParser().parseFromString(html, "text/html");
}

describe("root layout metadata", () => {
  it("takes the title and description of the home page", () => {
    expect(metadata.title).toBe(home.meta.title);
    expect(metadata.description).toBe(home.meta.description);
  });

  it("builds absolute URLs from the site base URL", () => {
    expect(String(metadata.metadataBase)).toBe(site.baseUrl);
    expect(metadata.alternates?.canonical).toBe(`${site.baseUrl}/`);
    expect(metadata.openGraph).toMatchObject({ url: `${site.baseUrl}/` });
  });

  it("shares a photo of a meetup, not a relative URL", () => {
    const images = metadata.openGraph?.images as string[];
    expect(images).toHaveLength(1);
    expect(images[0]).toMatch(
      new RegExp(`^${site.baseUrl}/assets/img/meetups/[\\w-]+\\.jpg$`),
    );
  });
});

describe("root layout", () => {
  afterEach(() => {
    document.documentElement.classList.remove("js");
  });

  it("is a French page with the content in the body", () => {
    const doc = renderLayout();
    expect(doc.documentElement.getAttribute("lang")).toBe("fr");
    expect(doc.body.textContent).toBe("Contenu");
  });

  it("puts a script in the head that adds the js class to the root element", () => {
    const doc = renderLayout();
    const script = doc.head.querySelector("script:not([src])");
    expect(script).not.toBeNull();
    expect(document.documentElement).not.toHaveClass("js");
    new Function(script?.textContent ?? "")();
    expect(document.documentElement).toHaveClass("js");
  });

  it("puts no js class in the server markup", () => {
    const doc = renderLayout();
    expect(doc.documentElement.classList.contains("js")).toBe(false);
  });
});

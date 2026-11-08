import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PageId } from "@/content/types";
import AccueillirLayout from "./accueillir/layout";
import AssociationLayout from "./association/layout";
import HomeLayout from "./(home)/layout";
import MeetupLayout from "./meetup/layout";
import NewsLayout from "./actualites/layout";
import SocratesLayout from "./socrates/layout";
import { PageFrame } from "./PageFrame";

// Nav labels from content/site.json. "Éditions" links to index.html#historique,
// an anchor, so it is never the current page.
function currentLinks() {
  const nav = screen.getByRole("navigation", { name: "Navigation principale" });
  return [...nav.querySelectorAll("a[aria-current='page']")].map(
    (a) => a.textContent,
  );
}

describe("PageFrame", () => {
  it.each<[PageId, string[]]>([
    ["home", []],
    ["meetup", ["Le meetup"]],
    ["socrates", ["SoCraTes"]],
    ["news", ["Actualités"]],
    ["association", ["L'association"]],
    ["host", []],
  ])("page %s marks %j as the current page", (page, expected) => {
    render(<PageFrame page={page}>contenu</PageFrame>);
    expect(currentLinks()).toEqual(expected);
  });

  it("keeps the skip link, header, main and footer in this order", () => {
    const { container } = render(
      <PageFrame page="meetup">
        <p>contenu</p>
      </PageFrame>,
    );
    const frame = container.firstElementChild as HTMLElement;
    expect([...frame.children].map((el) => el.tagName)).toEqual([
      "A",
      "HEADER",
      "MAIN",
      "FOOTER",
    ]);
    expect(frame.querySelector("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("main")).toHaveTextContent("contenu");
  });

  it("marks no nav link as current and sets no data-page without a page id", () => {
    const { container } = render(<PageFrame>contenu</PageFrame>);
    expect(currentLinks()).toEqual([]);
    expect(container.firstElementChild).not.toHaveAttribute("data-page");
    expect(screen.getByRole("main")).toHaveTextContent("contenu");
  });

  it("uses the default skip link to the main content", () => {
    render(<PageFrame page="meetup">x</PageFrame>);
    const link = screen.getByRole("link", { name: "Aller au contenu" });
    expect(link).toHaveAttribute("href", "#main");
  });

  it("takes a custom skip link label and target", () => {
    render(
      <PageFrame
        page="host"
        skip={{ href: "#funnel", label: "Aller au formulaire" }}
      >
        x
      </PageFrame>,
    );
    expect(
      screen.getByRole("link", { name: "Aller au formulaire" }),
    ).toHaveAttribute("href", "#funnel");
    expect(
      screen.queryByRole("link", { name: "Aller au contenu" }),
    ).not.toBeInTheDocument();
  });

  it("carries the page id in data-page", () => {
    const { container } = render(<PageFrame page="news">x</PageFrame>);
    expect(container.firstElementChild).toHaveAttribute("data-page", "news");
  });
});

describe("route layouts", () => {
  it.each([
    ["home", HomeLayout, "home", []],
    ["meetup", MeetupLayout, "meetup", ["Le meetup"]],
    ["actualites", NewsLayout, "news", ["Actualités"]],
    ["association", AssociationLayout, "association", ["L'association"]],
    ["socrates", SocratesLayout, "socrates", ["SoCraTes"]],
    ["accueillir", AccueillirLayout, "host", []],
  ])("the %s layout uses its page id", (_name, Layout, id, expected) => {
    const { container } = render(<Layout>contenu</Layout>);
    expect(container.firstElementChild).toHaveAttribute("data-page", id);
    expect(currentLinks()).toEqual(expected);
    expect(screen.getByRole("main")).toHaveTextContent("contenu");
  });

  it("the host layout skips to the form", () => {
    render(<AccueillirLayout>contenu</AccueillirLayout>);
    expect(
      screen.getByRole("link", { name: "Aller au formulaire" }),
    ).toHaveAttribute("href", "#funnel");
  });
});

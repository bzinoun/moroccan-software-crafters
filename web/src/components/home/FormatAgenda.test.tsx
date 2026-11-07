import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadEvents, loadHome } from "@/content/load";
import { formatSteps, topicsFromEvents } from "@/lib/home-data";
import { FormatAgenda } from "./FormatAgenda";

// Props are built from the real content files, as the home page passes them.
// Expected strings are literals read from content/home.json.
const TITLE = "Pas de conférenciers vedettes, des conversations.";

function renderAgenda() {
  const home = loadHome();
  return render(
    <FormatAgenda
      eyebrow={home.format.eyebrow}
      title={home.format.title}
      lead={home.format.lead}
      steps={formatSteps(home)}
      topics={topicsFromEvents(loadEvents(), home.topics.limit)}
      topicsLabel={home.topics.title}
      more={home.format.more}
    />,
  );
}

describe("FormatAgenda", () => {
  it("is the #format region named by its title, with eyebrow and lead", () => {
    renderAgenda();
    const section = screen.getByRole("region", { name: TITLE });
    expect(section).toHaveAttribute("id", "format");
    expect(
      within(section).getByRole("heading", { level: 2 }),
    ).toHaveTextContent(TITLE);
    expect(within(section).getByText("Le format")).toBeInTheDocument();
    expect(
      within(section).getByText(
        /^Un samedi, de 9 h 30 à 14 h, en open space\./,
      ),
    ).toBeInTheDocument();
  });

  it("keeps the plain section background", () => {
    renderAgenda();
    const section = screen.getByRole("region", { name: TITLE });
    expect(section.className).not.toMatch(/bg-sage-soft|bg-green-deep/);
  });

  it("lists the four steps in order, each with its number, time, title and text", () => {
    renderAgenda();
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    const expected = [
      ["01", "9 h 30", "Networking"],
      ["02", "10 h 15", "Lightning talks"],
      ["03", "11 h 00", "Bubble topics"],
      ["04", "13 h 15", "Rétrospective"],
    ] as const;
    expected.forEach(([num, time, title], i) => {
      const item = items[i]!;
      expect(item).toHaveTextContent(num);
      expect(item).toHaveTextContent(time);
      expect(
        within(item).getByRole("heading", { level: 3, name: title }),
      ).toBeInTheDocument();
    });
    expect(items[3]).toHaveTextContent(
      "Ce qu'on retient, ce qu'on change pour la prochaine fois, et à qui le tour d'accueillir.",
    );
  });

  it("hides the step number from assistive technology (the list already numbers)", () => {
    renderAgenda();
    const item = screen.getAllByRole("listitem")[0]!;
    const number = within(item).getByText("01");
    expect(number).toHaveAttribute("aria-hidden", "true");
  });

  it("shows each step photo as a decorative lazy image", () => {
    renderAgenda();
    const list = screen.getByRole("list");
    const images = Array.from(list.querySelectorAll("img"));
    expect(images).toHaveLength(4);
    expect(images[0]?.getAttribute("src")).toMatch(
      /\/assets\/img\/meetups\/2026-10-sg-gscm-7\.jpg$/,
    );
    expect(images[1]?.getAttribute("src")).toMatch(/2026-10-sg-gscm-3\.jpg$/);
    expect(images[2]?.getAttribute("src")).toMatch(/2026-03-innovx-3\.jpg$/);
    expect(images[3]?.getAttribute("src")).toMatch(/2026-05-axa-4\.jpg$/);
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  it("omits the photo block of a step that has none", () => {
    render(
      <FormatAgenda
        eyebrow="Le format"
        title="Titre"
        steps={[
          {
            time: "9 h 30",
            title: "Sans photo",
            text: "Texte",
            photoSrc: null,
          },
        ]}
        topics={[]}
        topicsLabel="Sujets"
      />,
    );
    const item = screen.getByRole("listitem");
    expect(item.querySelector("img")).toBeNull();
    expect(
      within(item).getByRole("heading", { level: 3, name: "Sans photo" }),
    ).toBeInTheDocument();
  });

  it("zooms the photo on card hover, only without reduced motion", () => {
    renderAgenda();
    const item = screen.getAllByRole("listitem")[0]!;
    const img = item.querySelector("img")!;
    expect(item).toHaveClass("group");
    expect(img).toHaveClass(
      "motion-safe:group-hover:scale-[1.04]",
      "motion-safe:transition-transform",
      "motion-safe:duration-500",
    );
    expect(img.className).not.toMatch(/(^|\s)group-hover:/);
  });

  it("lays the cards out in 1, 2 then 4 columns", () => {
    renderAgenda();
    const list = screen.getByRole("list");
    expect(list).toHaveClass("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4");
    expect(list).toHaveClass("gap-5");
  });

  it("shows the topic wall of post-its under the agenda", () => {
    renderAgenda();
    const wall = screen.getByRole("group", {
      name: "Sujets discutés lors des dernières éditions",
    });
    expect(wall.children).toHaveLength(10);
    expect(wall.children[0]).toHaveTextContent("AI factory");
    expect(wall.children[0]).toHaveTextContent("2026");
    const list = screen.getByRole("list");
    expect(
      list.compareDocumentPosition(wall) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("links to the detailed flow on the meetup page, after the wall", () => {
    renderAgenda();
    const link = screen.getByRole("link", {
      name: "Le déroulé détaillé, étape par étape",
    });
    expect(link).toHaveAttribute("href", "/meetup/");
    const wall = screen.getByRole("group", {
      name: "Sujets discutés lors des dernières éditions",
    });
    expect(
      wall.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders no link line when there is no more link", () => {
    render(
      <FormatAgenda
        eyebrow="Le format"
        title="Titre"
        steps={[]}
        topics={[]}
        topicsLabel="Sujets"
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("FormatAgenda list semantics", () => {
  it("keeps the numbered steps a list, Safari drops the role when the list style is none", () => {
    const { container } = renderAgenda();
    const steps = container.querySelector("ol");
    expect(steps).toHaveAttribute("role", "list");
  });
});

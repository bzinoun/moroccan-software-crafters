import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FormatStepItem, TopicNote } from "@/lib/home-data";
import { FormatAgenda } from "./FormatAgenda";

// Fixtures written here: the component draws the head, the steps, the topics
// and the more link it gets.
const TITLE = "Pas de vedettes, des conversations.";
const TOPICS_LABEL = "Sujets des dernières éditions";

const STEPS: FormatStepItem[] = [
  {
    time: "9 h 30",
    title: "Accueil",
    text: "On se retrouve autour d'un café.",
    photoSrc: "/assets/img/meetups/2026-10-alpha-7.jpg",
  },
  {
    time: "10 h 15",
    title: "Éclairs",
    text: "Des talks de cinq minutes.",
    photoSrc: "/assets/img/meetups/2026-10-alpha-3.jpg",
  },
  {
    time: "11 h 00",
    title: "Bulles",
    text: "Des groupes se forment sur un sujet.",
    photoSrc: "/assets/img/meetups/2026-03-gamma-3.jpg",
  },
  {
    time: "13 h 15",
    title: "Rétrospective",
    text: "Ce qu'on retient, et à qui le tour d'accueillir.",
    photoSrc: "/assets/img/meetups/2026-05-beta-4.jpg",
  },
];

const TOPICS: TopicNote[] = [
  { topic: "Premier sujet", year: "2026", tone: "default" },
  { topic: "Deuxième sujet", year: "2025", tone: "pink" },
  { topic: "Troisième sujet", year: "2025", tone: "green" },
];

const MORE = { label: "Le déroulé détaillé", href: "/meetup/" };

function renderAgenda() {
  return render(
    <FormatAgenda
      eyebrow="Le format"
      title={TITLE}
      lead="Un samedi matin, en open space."
      steps={STEPS}
      topics={TOPICS}
      topicsLabel={TOPICS_LABEL}
      more={MORE}
    />,
  );
}

describe("FormatAgenda without a step", () => {
  it("renders the head and the topics but no empty list", () => {
    const { container } = render(
      <FormatAgenda
        eyebrow="Le format"
        title={TITLE}
        steps={[]}
        topics={TOPICS}
        topicsLabel={TOPICS_LABEL}
      />,
    );
    expect(container.querySelector("ol")).toBeNull();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });
});

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
      within(section).getByText("Un samedi matin, en open space."),
    ).toBeInTheDocument();
  });

  it("lists the steps in order, each with its number, time, title and text", () => {
    renderAgenda();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(STEPS.length);
    STEPS.forEach((step, i) => {
      const item = items[i]!;
      expect(item).toHaveTextContent(`0${i + 1}`);
      expect(item).toHaveTextContent(step.time);
      expect(
        within(item).getByRole("heading", { level: 3, name: step.title }),
      ).toBeInTheDocument();
      expect(item).toHaveTextContent(step.text);
    });
  });

  it("hides the step number from assistive technology (the list already numbers)", () => {
    renderAgenda();
    const item = screen.getAllByRole("listitem")[0]!;
    expect(within(item).getByText("01")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows each step photo as a decorative lazy image", () => {
    renderAgenda();
    const images = Array.from(screen.getByRole("list").querySelectorAll("img"));
    expect(images.map((img) => img.getAttribute("src"))).toEqual(
      STEPS.map((step) => step.photoSrc),
    );
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
    const img = screen.getAllByRole("listitem")[0]!.querySelector("img")!;
    expect(img.className).toMatch(/motion-safe:group-hover:scale-/);
    expect(img.className).not.toMatch(/(^|\s)group-hover:/);
  });

  it("shows one post-it per topic under the agenda", () => {
    renderAgenda();
    const wall = screen.getByRole("group", { name: TOPICS_LABEL });
    expect(wall.children).toHaveLength(TOPICS.length);
    expect(wall.children[0]).toHaveTextContent("Premier sujet");
    expect(wall.children[0]).toHaveTextContent("2026");
    const list = screen.getByRole("list");
    expect(list.compareDocumentPosition(wall)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("links to the detailed flow on the meetup page, after the wall", () => {
    renderAgenda();
    const link = screen.getByRole("link", { name: MORE.label });
    expect(link).toHaveAttribute("href", "/meetup/");
    const wall = screen.getByRole("group", { name: TOPICS_LABEL });
    expect(wall.compareDocumentPosition(link)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
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
    expect(container.querySelector("ol")).toHaveAttribute("role", "list");
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadMeetup } from "@/content/load";
import { meetupPhotoUrl } from "@/lib/derive";
import { ZoomSplit } from "./ZoomSplit";

// Props come from content/meetup.json (marketplace). The alt text is hard-coded
// in the former `meetup.html` (`git show 1353207:meetup.html`), not in the JSON.
const { marketplace } = loadMeetup();

function renderZoom() {
  const { container } = render(
    <ZoomSplit
      id="marketplace"
      eyebrow={marketplace.eyebrow}
      title={marketplace.title}
      steps={marketplace.steps}
      image={{
        src: meetupPhotoUrl(marketplace.photo),
        alt: "Un participant devant le mur de post-its",
      }}
    />,
  );
  return container.querySelector("section") as HTMLElement;
}

describe("ZoomSplit", () => {
  it("is the section #marketplace named by its level 2 title", () => {
    const section = renderZoom();
    expect(section).toHaveAttribute("id", "marketplace");
    expect(
      screen.getByRole("region", {
        name: "Comment naissent les trois tables rondes",
      }),
    ).toBe(section);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Comment naissent les trois tables rondes",
      }),
    ).toBeInTheDocument();
  });

  it("shows the eyebrow above the title", () => {
    renderZoom();
    expect(screen.getByText("Zoom")).toBeInTheDocument();
  });

  it("shows the photo of the wall with its alt text, lazy, 800 by 771", () => {
    renderZoom();
    const img = screen.getByRole("img", {
      name: "Un participant devant le mur de post-its",
    });
    expect(img).toHaveAttribute("src", "/assets/img/meetups/2026-05-axa-3.jpg");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "771");
  });

  it("lists the four steps as a numbered list beside the photo", () => {
    renderZoom();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[2]).toHaveTextContent("Un vote par personne et par bulle");
  });

  it("puts the photo first in the source, then the text", () => {
    const section = renderZoom();
    const grid = section.firstElementChild as HTMLElement;
    expect(grid.firstElementChild?.tagName).toBe("IMG");
    expect(grid.lastElementChild).toContainElement(screen.getByRole("list"));
    expect(grid).toHaveClass("md:grid-cols-[1fr_1.1fr]");
  });
});

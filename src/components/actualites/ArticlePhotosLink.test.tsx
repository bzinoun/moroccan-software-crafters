import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PhotoItem } from "@/lib/derive";
import { LightboxProvider } from "../Lightbox";
import { ArticlePhotosLink } from "./ArticlePhotosLink";

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

const photos: PhotoItem[] = [
  {
    photo: "first",
    src: "/assets/img/first.jpg",
    caption: "First photo · 24 oct. 2026",
    eventId: "2026-10-test",
  },
  {
    photo: "second",
    src: "/assets/img/second.jpg",
    caption: "Second photo · 24 oct. 2026",
    eventId: "2026-10-test",
  },
];

function renderLink() {
  return render(
    <LightboxProvider>
      <ArticlePhotosLink label="Les 2 photos" photos={photos} />
    </LightboxProvider>,
  );
}

describe("ArticlePhotosLink", () => {
  it("is a link to the first photo file, so it works without JavaScript", () => {
    renderLink();
    expect(screen.getByRole("link", { name: "Les 2 photos" })).toHaveAttribute(
      "href",
      photos[0]!.src,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("does not open the lightbox before the click", () => {
    renderLink();
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    );
  });

  it("opens the lightbox on the first photo of the event", async () => {
    renderLink();
    await userEvent.click(screen.getByRole("link", { name: "Les 2 photos" }));
    const dialog = screen.getByRole("dialog", { name: "Photo agrandie" });
    expect(dialog).toHaveAttribute("open");
    expect(
      within(dialog).getByRole("img", { name: /First photo/ }),
    ).toHaveAttribute("src", photos[0]!.src);
  });

  it("does not follow the link when it opens the lightbox", () => {
    renderLink();
    const link = screen.getByRole("link", { name: "Les 2 photos" });
    expect(fireEvent.click(link)).toBe(false);
  });

  it("leaves a click with a modifier key to the browser", () => {
    renderLink();
    const link = screen.getByRole("link", { name: "Les 2 photos" });
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    );
  });

  it("gives the focus back to the photo link when the lightbox closes", () => {
    renderLink();
    const link = screen.getByRole("link", { name: "Les 2 photos" });
    // fireEvent.click does not focus the link, as Safari does not on a click.
    fireEvent.click(link);
    expect(
      screen.getByRole("dialog", { name: "Photo agrandie" }),
    ).toHaveAttribute("open");
    (document.querySelector("dialog") as HTMLDialogElement).close();
    expect(link).toHaveFocus();
  });

  it("throws when no LightboxProvider is above it", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(<ArticlePhotosLink label="Les 2 photos" photos={photos} />),
    ).toThrow("useLightbox must be used inside LightboxProvider");
    error.mockRestore();
  });
});

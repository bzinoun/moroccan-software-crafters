import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { PhotoItem } from "@/lib/derive";
import { inMemoryModalDialog } from "@/test/in-memory-modal-dialog";
import { renderWithPorts } from "@/test/ports";
import { renderCatching } from "@/test/render-catching";
import { LightboxProvider } from "../Lightbox";
import { ArticlePhotosLink } from "./ArticlePhotosLink";

// jsdom has no showModal() or close(): the in-memory ModalDialog port stands in.
let modal = inMemoryModalDialog();
beforeEach(() => {
  modal = inMemoryModalDialog();
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
  return renderWithPorts(
    <LightboxProvider>
      <ArticlePhotosLink label="Les 2 photos" photos={photos} />
    </LightboxProvider>,
    { modalDialog: modal },
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
    modal.close(document.querySelector("dialog") as HTMLDialogElement);
    expect(link).toHaveFocus();
  });

  it("throws when no LightboxProvider is above it", () => {
    const { errors } = renderCatching(
      <ArticlePhotosLink label="Les 2 photos" photos={photos} />,
    );
    expect(errors).toHaveLength(1);
    expect((errors[0] as Error).message).toBe(
      "useLightbox must be used inside LightboxProvider",
    );
  });
});

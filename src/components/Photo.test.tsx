import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Photo } from "./Photo";

describe("Photo", () => {
  it("loads lazily and decodes asynchronously by default", () => {
    render(<Photo src="/a.jpg" alt="Une salle" />);
    const img = screen.getByRole("img", { name: "Une salle" });
    expect(img).toHaveAttribute("src", "/a.jpg");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("loads at once when it is eager", () => {
    render(<Photo src="/a.jpg" alt="Une salle" eager />);
    const img = screen.getByRole("img", { name: "Une salle" });
    expect(img).not.toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("passes the other attributes through", () => {
    render(
      <Photo
        src="/a.jpg"
        alt="Une salle"
        width={800}
        height={600}
        className="photo"
        data-testid="photo"
      />,
    );
    const img = screen.getByTestId("photo");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "600");
    expect(img).toHaveClass("photo");
  });

  it("is decorative with an empty alt", () => {
    render(<Photo src="/a.jpg" alt="" />);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("forwards a ref to the image element", () => {
    const ref = createRef<HTMLImageElement>();
    render(<Photo src="/a.jpg" alt="Une salle" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("img", { name: "Une salle" }));
  });
});

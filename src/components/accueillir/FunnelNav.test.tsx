import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { recorder } from "@/test/recorder";
import { FunnelNav } from "./FunnelNav";

describe("FunnelNav", () => {
  it("hides Retour on the first step and offers Continuer", () => {
    render(<FunnelNav step={1} busy={false} onPrev={() => {}} />);
    expect(screen.queryByRole("button", { name: "Retour" })).toBeNull();
    const next = screen.getByRole("button", { name: "Continuer" });
    expect(next).toHaveAttribute("id", "next");
    expect(next).toHaveAttribute("type", "submit");
  });

  it("calls onPrev from Retour, a plain button, on the next steps", async () => {
    const onPrev = recorder<[]>();
    render(<FunnelNav step={2} busy={false} onPrev={onPrev.fn} />);
    const prev = screen.getByRole("button", { name: "Retour" });
    expect(prev).toHaveAttribute("id", "prev");
    expect(prev).toHaveAttribute("type", "button");
    await userEvent.click(prev);
    expect(onPrev.calls).toHaveLength(1);
  });

  it("names the last step button Envoyer ma demande", () => {
    render(<FunnelNav step={4} busy={false} onPrev={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Envoyer ma demande" }),
    ).toBeEnabled();
  });

  it("marks the button busy and reads Envoi… while sending", () => {
    render(<FunnelNav step={4} busy onPrev={() => {}} />);
    expect(screen.getByRole("button", { name: "Envoi…" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("keeps the focus on the button while sending: it is not natively disabled", () => {
    const { rerender } = render(
      <FunnelNav step={4} busy={false} onPrev={() => {}} />,
    );
    screen.getByRole("button", { name: "Envoyer ma demande" }).focus();
    rerender(<FunnelNav step={4} busy onPrev={() => {}} />);
    const button = screen.getByRole("button", { name: "Envoi…" });
    expect(button).toBeEnabled();
    expect(button).toHaveFocus();
  });

  it("has no busy mark when idle", () => {
    render(<FunnelNav step={2} busy={false} onPrev={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Continuer" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("is a control for script only: it is gone for a visitor with no script", () => {
    render(<FunnelNav step={2} busy={false} onPrev={() => {}} />);
    const bar = screen.getByRole("button", { name: "Continuer" }).parentElement;
    expect(bar).toHaveClass("not-js:hidden");
    expect(bar).toContainElement(
      screen.getByRole("button", { name: "Retour" }),
    );
  });
});

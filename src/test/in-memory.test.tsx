import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { submitForm, type SubmitInput } from "@/lib/forms";
import { Reveal } from "@/components/Reveal";
import { PortsProvider } from "@/lib/ports";
import { inMemoryClock } from "./in-memory-clock";
import { inMemoryErrorReporter } from "./in-memory-error-reporter";
import { inMemoryImageProbe } from "./in-memory-image-probe";
import { inMemoryLeadSubmit } from "./in-memory-lead-submit";
import { inMemoryModalDialog } from "./in-memory-modal-dialog";
import { inMemoryMotion } from "./in-memory-motion";
import { inMemoryScroller } from "./in-memory-scroller";
import { deniedStorage, inMemoryStorage } from "./in-memory-storage";
import { inMemorySubmitDeps } from "./in-memory-submit-deps";
import { inMemoryViewport } from "./in-memory-viewport";
import { recorder } from "./recorder";
import { renderCatching } from "./render-catching";
import { renderWithPorts } from "./ports";

const INPUT: SubmitInput = {
  site: { form: { endpoint: "https://example.test/f/x", extraFields: {} } },
  data: { email: "sara@acme.ma" },
  type: "Test",
  subject: "Sujet",
};

describe("inMemoryClock", () => {
  it("answers its instant until moved, as a new Date each time", () => {
    const clock = inMemoryClock(new Date("2026-11-07T10:00:00Z"));
    expect(clock.now().toISOString()).toBe("2026-11-07T10:00:00.000Z");
    clock.now().setFullYear(2000);
    expect(clock.now().getFullYear()).toBe(2026);
    clock.set(new Date("2026-12-01T00:00:00Z"));
    expect(clock.now().toISOString()).toBe("2026-12-01T00:00:00.000Z");
  });
});

describe("inMemoryStorage", () => {
  it("keeps, reads and removes text, and starts from the given entries", () => {
    const store = inMemoryStorage({ a: "1" });
    expect(store.getItem("a")).toBe("1");
    store.setItem("b", "2");
    expect(store.entries.get("b")).toBe("2");
    store.removeItem("a");
    expect(store.getItem("a")).toBeNull();
  });

  it("deniedStorage throws on every call", () => {
    const store = deniedStorage();
    expect(() => store.getItem("a")).toThrow("denied");
    expect(() => store.setItem("a", "1")).toThrow("denied");
    expect(() => store.removeItem("a")).toThrow("denied");
  });
});

describe("inMemoryErrorReporter", () => {
  it("records the message, and the cause when there is one", () => {
    const reporter = inMemoryErrorReporter();
    const cause = new Error("boom");
    reporter.report("one");
    reporter.report("two", cause);
    expect(reporter.reports).toEqual([
      { message: "one" },
      { message: "two", cause },
    ]);
  });
});

describe("inMemoryMotion and inMemoryScroller", () => {
  it("answers the fixed preference", () => {
    expect(inMemoryMotion(true).prefersReducedMotion()).toBe(true);
    expect(inMemoryMotion(false).prefersReducedMotion()).toBe(false);
  });

  it("records each scroll", () => {
    const scroller = inMemoryScroller();
    scroller.toElement("funnel", "smooth");
    expect(scroller.scrolls).toEqual([{ id: "funnel", behavior: "smooth" }]);
  });
});

describe("inMemoryImageProbe", () => {
  it("reports failure only for the listed sources", () => {
    const probe = inMemoryImageProbe(["/bad.png"]);
    const image = (src: string) => {
      const img = document.createElement("img");
      img.setAttribute("src", src);
      return img;
    };
    expect(probe.hasFailedToLoad(image("/bad.png"))).toBe(true);
    expect(probe.hasFailedToLoad(image("/good.png"))).toBe(false);
  });
});

describe("inMemoryModalDialog", () => {
  it("opens as a modal, records it, and fires close once when closed", () => {
    const modal = inMemoryModalDialog();
    const dialog = document.createElement("dialog");
    const closes = recorder<[Event]>();
    dialog.addEventListener("close", (event) => closes.fn(event));
    modal.showModal(dialog);
    expect(dialog).toHaveAttribute("open");
    expect(modal.modalOpens).toEqual([dialog]);
    modal.close(dialog);
    modal.close(dialog);
    expect(dialog).not.toHaveAttribute("open");
    expect(closes.calls).toHaveLength(1);
  });
});

describe("inMemoryLeadSubmit", () => {
  it("records the inputs and answers the default result", async () => {
    const lead = inMemoryLeadSubmit({ mode: "mailto", url: "mailto:x@y.ma" });
    await expect(lead.submit(INPUT)).resolves.toEqual({
      mode: "mailto",
      url: "mailto:x@y.ma",
    });
    expect(lead.calls).toEqual([INPUT]);
  });

  it("answers once, then the default; fails once, then the default", async () => {
    const lead = inMemoryLeadSubmit();
    lead.answerOnce({ mode: "none" });
    lead.failOnce(new Error("boom"));
    await expect(lead.submit(INPUT)).resolves.toEqual({ mode: "none" });
    await expect(lead.submit(INPUT)).rejects.toThrow("boom");
    await expect(lead.submit(INPUT)).resolves.toEqual({ mode: "endpoint" });
  });

  it("fails from now on after fail, and answers after answer", async () => {
    const lead = inMemoryLeadSubmit();
    lead.fail(new Error("down"));
    await expect(lead.submit(INPUT)).rejects.toThrow("down");
    lead.answer({ mode: "honeypot" });
    await expect(lead.submit(INPUT)).resolves.toEqual({ mode: "honeypot" });
  });

  it("holds the next send until the test settles it", async () => {
    const lead = inMemoryLeadSubmit();
    const { settle } = lead.hold();
    let done = false;
    const sent = lead.submit(INPUT).then((result) => {
      done = true;
      return result;
    });
    await Promise.resolve();
    expect(done).toBe(false);
    settle({ mode: "endpoint" });
    await expect(sent).resolves.toEqual({ mode: "endpoint" });
  });
});

describe("inMemorySubmitDeps", () => {
  it("records the request that submitForm makes and answers a real Response", async () => {
    const { deps, requests } = inMemorySubmitDeps({ search: "?utm_source=x" });
    await expect(submitForm(INPUT, deps)).resolves.toEqual({
      mode: "endpoint",
    });
    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe("https://example.test/f/x");
    expect(JSON.parse(String(requests[0]?.init?.body)).utm_source).toBe("x");
  });

  it("answers the chosen status and records navigations", async () => {
    const { deps, navigations } = inMemorySubmitDeps({ status: 500 });
    const result = await submitForm(
      { ...INPUT, site: { ...INPUT.site, contact: { email: "a@b.ma" } } },
      deps,
    );
    expect(result.mode).toBe("error");
    const mail = inMemorySubmitDeps();
    await submitForm(
      { ...INPUT, site: { contact: { email: "a@b.ma" } } },
      mail.deps,
    );
    expect(navigations).toEqual([]);
    expect(mail.navigations).toHaveLength(1);
  });

  it("fails the request with the network error", async () => {
    const { deps } = inMemorySubmitDeps({ networkError: new Error("offline") });
    const result = await submitForm(INPUT, deps);
    expect(result.mode === "error" && result.error.message).toBe("offline");
  });
});

describe("inMemoryViewport", () => {
  it("drives Reveal through the port: waits below the fold, shows on becomeVisible", () => {
    const viewport = inMemoryViewport();
    renderWithPorts(<Reveal>Les formules</Reveal>, { viewport });
    const reveal = screen.getByText("Les formules");
    expect(reveal).toHaveAttribute("data-reveal", "waiting");
    expect(viewport.watches).toHaveLength(1);
    act(() => viewport.becomeVisible());
    expect(reveal).toHaveAttribute("data-reveal", "shown");
    expect(viewport.watches[0]?.stopped).toBe(true);
  });

  it("moves an element with placeAt", () => {
    const viewport = inMemoryViewport({ top: 5 });
    expect(viewport.topOf(document.body)).toBe(5);
    viewport.placeAt(900);
    expect(viewport.topOf(document.body)).toBe(900);
    expect(viewport.height()).toBe(768);
  });
});

describe("recorder", () => {
  it("stores the arguments of every call", () => {
    const clicks = recorder<[string, number]>();
    clicks.fn("a", 1);
    clicks.fn("b", 2);
    expect(clicks.calls).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });
});

describe("renderCatching", () => {
  it("returns the error that a child throws, with no console noise", () => {
    function Boom(): never {
      throw new Error("no provider");
    }
    const { errors } = renderCatching(<Boom />);
    expect(errors).toHaveLength(1);
    expect((errors[0] as Error).message).toBe("no provider");
  });
});

describe("PortsProvider with in-memory adapters", () => {
  it("renders children as before", () => {
    render(
      <PortsProvider ports={{}}>
        <p>ok</p>
      </PortsProvider>,
    );
    expect(screen.getByText("ok")).toBeInTheDocument();
  });
});

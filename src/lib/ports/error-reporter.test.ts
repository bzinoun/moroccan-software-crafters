import { describe, expect, it } from "vitest";
import { reporterTo } from "./error-reporter";

function setup() {
  const logged: unknown[][] = [];
  const reporter = reporterTo((...args) => {
    logged.push(args);
  });
  return { reporter, logged };
}

describe("reporterTo", () => {
  it("logs the message alone when there is no cause", () => {
    const { reporter, logged } = setup();
    reporter.report("[MSC] envoi échoué");
    expect(logged).toEqual([["[MSC] envoi échoué"]]);
  });

  it("logs the message and the cause", () => {
    const { reporter, logged } = setup();
    const cause = new Error("réseau");
    reporter.report("[MSC] envoi échoué", cause);
    expect(logged).toEqual([["[MSC] envoi échoué", cause]]);
  });
});

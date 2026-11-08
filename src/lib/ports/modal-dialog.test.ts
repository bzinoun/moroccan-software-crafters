import { describe, expect, it } from "vitest";
import { browserModalDialog } from "./modal-dialog";

// jsdom has no showModal() or close(), so the real adapter runs against a real
// dialog subclass that records the calls the adapter makes on it.
class RecordingDialog extends HTMLDialogElement {
  calls: string[] = [];
  override showModal() {
    this.calls.push("showModal");
  }
  override close() {
    this.calls.push("close");
  }
}
customElements.define("recording-dialog", RecordingDialog, {
  extends: "dialog",
});

describe("browserModalDialog", () => {
  it("opens the dialog as a modal", () => {
    const dialog = document.createElement("dialog", {
      is: "recording-dialog",
    }) as RecordingDialog;
    browserModalDialog.showModal(dialog);
    expect(dialog.calls).toEqual(["showModal"]);
  });

  it("closes the dialog", () => {
    const dialog = document.createElement("dialog", {
      is: "recording-dialog",
    }) as RecordingDialog;
    browserModalDialog.close(dialog);
    expect(dialog.calls).toEqual(["close"]);
  });
});

import type { ModalDialog } from "@/lib/ports/modal-dialog";

/**
 * Modal bookkeeping that jsdom lacks. `showModal` sets `open` and records the
 * call; `close` removes `open` and fires the "close" event, as a browser does
 * for the close button, the backdrop click and Escape. A test closes with
 * `close(dialog)` to play Escape.
 */
export function inMemoryModalDialog() {
  const modalOpens: HTMLDialogElement[] = [];
  const dialogs: ModalDialog = {
    showModal(dialog) {
      modalOpens.push(dialog);
      dialog.setAttribute("open", "");
    },
    close(dialog) {
      if (!dialog.hasAttribute("open")) return;
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    },
  };
  return { ...dialogs, modalOpens };
}

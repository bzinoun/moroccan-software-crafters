// Port: open and close a dialog element as a modal. jsdom has no
// `showModal()` or `close()`, so a test passes an adapter that does the same
// bookkeeping in memory.

export type ModalDialog = {
  showModal(dialog: HTMLDialogElement): void;
  close(dialog: HTMLDialogElement): void;
};

export const browserModalDialog: ModalDialog = {
  showModal: (dialog) => dialog.showModal(),
  close: (dialog) => dialog.close(),
};

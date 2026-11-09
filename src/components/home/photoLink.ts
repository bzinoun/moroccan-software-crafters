import type { MouseEvent } from "react";

// Click handler for a link to a photo file that a script turns into a lightbox
// opener. A plain click opens the lightbox instead of the file. A click with a
// modifier key (a new tab, a download) is left to the browser. The link takes
// the focus first: Safari does not focus a link on click, and the lightbox
// gives the focus back to the element that was active when it opened.
export function openPhoto(open: () => void) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    event.currentTarget.focus();
    open();
  };
}

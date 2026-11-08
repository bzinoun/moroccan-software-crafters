// Test helper for the progressive enhancement variants. jsdom loads no
// stylesheet, so the `js:` and `not-js:` variants would change nothing in a
// test. This installs the one rule each of them stands for (the same meaning as
// the `js` custom variant of globals.css), and `setJs` adds or removes the
// class that the head script of the root layout puts on <html>. The role
// queries of Testing Library then skip what the real page hides.

const RULES = [
  "html.js .js\\:hidden { display: none; }",
  "html:not(.js) .not-js\\:hidden { display: none; }",
].join("\n");

export function setJs(enabled: boolean): void {
  if (!document.head.querySelector("style[data-js-mode]")) {
    const style = document.createElement("style");
    style.dataset.jsMode = "";
    style.textContent = RULES;
    document.head.append(style);
  }
  document.documentElement.classList.toggle("js", enabled);
}

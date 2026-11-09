// A mini Markdown renderer. It returns React nodes, never an HTML string, so React escapes all text and
// no input can add an element that this module does not create.
//
// Blocks (separated by a blank line): `#`, `##`, `###` headings (`#` and `##`
// render h2, `###` renders h3: the page h1 is the article title), `-` or `*`
// lists, `1.` or `1)` lists, `>` quotes, paragraphs (single line breaks become
// <br>). Inline: `code`, **bold**, *emphasis* and [text](url). A URL is an https
// URL or a site route that starts with one `/` (letters, digits, `_ . / # ? = -`);
// anything else, `javascript:` or a path without a leading slash for example, stays text.
//
// Rules:
// - the content of a code span stays literal (no stars are read in it);
// - links are read before bold and emphasis, so stars in a URL or bold around a link work;
// - a site route opens in the same tab, an https URL opens in a new tab with
//   rel="noopener";
// - a URL that starts with `//` is not a link;
// - plain text goes through frenchSpacing() (a narrow no-break space before
//   ? ! : ;) on every text node; code spans and hrefs do not;
// - empty input gives no node.

import { PageLink } from "@/components/PageLink";
import { createElement, type ReactElement, type ReactNode } from "react";
import { frenchSpacing } from "./french";

// Private-use characters mark the structure inside a line while the regexes run.
// They are stripped from the input first, so the input cannot forge a marker.
const OPEN = "";
const CLOSE = "";
const END = "";
const FORGED = /[-]/g;
const TOKEN = /([seac])(\d*)|([sea])/g;

const LINK = /\[([^\]]+)\]\((https:\/\/[^)\s]+|\/[\w./#?=-]*)\)/g;

type Kind = "s" | "e" | "a";
type Frame = { kind: Kind | "root"; href?: string; children: ReactNode[] };

function closeFrame(frame: Frame, key: number): ReactElement {
  const { kind, href, children } = frame;
  if (kind === "s") return createElement("strong", { key }, ...children);
  if (kind === "e") return createElement("em", { key }, ...children);
  return createElement(PageLink, { key, href: href ?? "" }, ...children);
}

function inline(source: string): ReactNode[] {
  const codes: string[] = [];
  const hrefs: string[] = [];
  const marked = source
    .replace(FORGED, "")
    .replace(/`([^`]+)`/g, (_m, code: string) => {
      codes.push(code);
      return `${OPEN}c${codes.length - 1}${END}`;
    })
    .replace(LINK, (whole, text: string, href: string) => {
      if (href.startsWith("//")) return whole;
      hrefs.push(href);
      return `${OPEN}a${hrefs.length - 1}${END}${text}${CLOSE}a${END}`;
    })
    .replace(/\*\*([^*]+)\*\*/g, `${OPEN}s${END}$1${CLOSE}s${END}`)
    .replace(/\*([^*]+)\*/g, `${OPEN}e${END}$1${CLOSE}e${END}`);

  const stack: Frame[] = [{ kind: "root", children: [] }];
  const top = (): Frame => stack[stack.length - 1] as Frame;
  const pop = (): void => {
    const frame = stack.pop() as Frame;
    const parent = top();
    parent.children.push(closeFrame(frame, parent.children.length));
  };

  let last = 0;
  for (const match of marked.matchAll(TOKEN)) {
    if (match.index > last)
      top().children.push(frenchSpacing(marked.slice(last, match.index)));
    last = match.index + match[0].length;
    const [, openKind, index, closeKind] = match;
    if (openKind === "c") {
      const parent = top();
      parent.children.push(
        createElement(
          "code",
          { key: parent.children.length },
          codes[Number(index)],
        ),
      );
    } else if (openKind === "s" || openKind === "e") {
      stack.push({ kind: openKind, children: [] });
    } else if (openKind === "a") {
      stack.push({ kind: "a", href: hrefs[Number(index)], children: [] });
    } else {
      // A close marker ends the nearest open element of its kind, and the
      // elements opened inside it; with no such element it is ignored.
      const depth = stack.map((f) => f.kind).lastIndexOf(closeKind as Kind);
      while (depth > 0 && stack.length > depth) pop();
    }
  }
  if (last < marked.length)
    top().children.push(frenchSpacing(marked.slice(last)));
  while (stack.length > 1) pop();
  return top().children;
}

function block(lines: string[], key: number): ReactElement {
  const first = lines[0] ?? "";
  const heading = /^(#{1,3})\s+(.*)$/.exec(first);
  if (heading && lines.length === 1) {
    return createElement(
      `h${Math.max(2, (heading[1] as string).length)}`,
      { key },
      ...inline(heading[2] as string),
    );
  }
  if (lines.every((l) => /^[-*]\s+/.test(l))) {
    return createElement(
      "ul",
      { key },
      ...lines.map((l, i) =>
        createElement("li", { key: i }, ...inline(l.replace(/^[-*]\s+/, ""))),
      ),
    );
  }
  if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
    return createElement(
      "ol",
      { key },
      ...lines.map((l, i) =>
        createElement(
          "li",
          { key: i },
          ...inline(l.replace(/^\d+[.)]\s+/, "")),
        ),
      ),
    );
  }
  if (lines.every((l) => /^>\s?/.test(l))) {
    return createElement(
      "blockquote",
      { key },
      ...inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" ")),
    );
  }
  const parts: ReactNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) parts.push(createElement("br", { key: `br${i}` }));
    parts.push(...inline(line));
  });
  return createElement("p", { key }, ...parts);
}

/**
 * Renders the mini Markdown of an article body to React elements.
 * Wrap the result in an element that styles h2, h3, h4, ul, ol, li,
 * blockquote, code and a (the `Prose` component does it).
 */
export function md(text: string | null | undefined): ReactElement[] {
  const source = String(text ?? "")
    .replace(/\r/g, "")
    .trim();
  if (source === "") return [];
  return source.split(/\n{2,}/).map((b, i) => block(b.split("\n"), i));
}

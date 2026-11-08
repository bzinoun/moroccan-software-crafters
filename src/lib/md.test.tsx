import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadArticles } from "@/content/load";
import { md } from "./md";

function html(text: string | null | undefined): string {
  const { container } = render(<div>{md(text)}</div>);
  return container.firstElementChild?.innerHTML ?? "";
}

describe("md blocks", () => {
  it.each([
    ["a paragraph", "Bonjour", "<p>Bonjour</p>"],
    ["two paragraphs", "Un\n\nDeux", "<p>Un</p><p>Deux</p>"],
    ["many blank lines", "Un\n\n\n\nDeux", "<p>Un</p><p>Deux</p>"],
    ["a line break inside a paragraph", "a\nb", "<p>a<br>b</p>"],
    ["three lines", "a\nb\nc", "<p>a<br>b<br>c</p>"],
    ["CRLF line endings", "a\r\n\r\nb", "<p>a</p><p>b</p>"],
    ["outer blank lines trimmed", "\n\n  a  \n\n", "<p>a</p>"],
    ["heading 1 becomes h2", "# Titre", "<h2>Titre</h2>"],
    ["heading 2 becomes h2, below the page h1", "## Titre", "<h2>Titre</h2>"],
    ["heading 3 becomes h3", "### Titre", "<h3>Titre</h3>"],
    [
      "heading with inline markup",
      "## Un **gras**",
      "<h2>Un <strong>gras</strong></h2>",
    ],
    ["four hashes stay a paragraph", "#### Titre", "<p>#### Titre</p>"],
    ["no space after the hash stays a paragraph", "#Titre", "<p>#Titre</p>"],
    [
      "a heading followed by a line is a paragraph",
      "## T\nsuite",
      "<p>## T<br>suite</p>",
    ],
    ["dash list", "- a\n- b", "<ul><li>a</li><li>b</li></ul>"],
    ["star list", "* a\n* b", "<ul><li>a</li><li>b</li></ul>"],
    ["mixed markers list", "- a\n* b", "<ul><li>a</li><li>b</li></ul>"],
    [
      "list item with markup",
      "- a **b**",
      "<ul><li>a <strong>b</strong></li></ul>",
    ],
    ["numbered list with dots", "1. a\n2. b", "<ol><li>a</li><li>b</li></ol>"],
    [
      "numbered list with parentheses",
      "1) a\n2) b",
      "<ol><li>a</li><li>b</li></ol>",
    ],
    ["a list with one plain line is a paragraph", "- a\nb", "<p>- a<br>b</p>"],
    ["a dash without a space is a paragraph", "-a", "<p>-a</p>"],
    ["blockquote", "> citation", "<blockquote>citation</blockquote>"],
    [
      "blockquote lines joined by a space",
      "> a\n> b",
      "<blockquote>a b</blockquote>",
    ],
    [
      "blockquote without a space after the sign",
      ">a",
      "<blockquote>a</blockquote>",
    ],
    [
      "blocks in sequence",
      "# T\n\ntexte\n\n- a\n- b",
      "<h2>T</h2><p>texte</p><ul><li>a</li><li>b</li></ul>",
    ],
  ])("renders %s", (_name, input, expected) => {
    expect(html(input)).toBe(expected);
  });

  it.each([[""], ["   \n\n  "], [null], [undefined]])(
    "renders nothing for %j",
    (input) => {
      expect(html(input)).toBe("");
    },
  );
});

describe("md inline", () => {
  it.each([
    ["bold", "a **b** c", "<p>a <strong>b</strong> c</p>"],
    ["italic", "a *b* c", "<p>a <em>b</em> c</p>"],
    ["code", "a `b` c", "<p>a <code>b</code> c</p>"],
    [
      "bold and italic side by side",
      "**a** *b*",
      "<p><strong>a</strong> <em>b</em></p>",
    ],
    [
      "two bolds",
      "**a** et **b**",
      "<p><strong>a</strong> et <strong>b</strong></p>",
    ],
    [
      "code inside bold",
      "**a `b` c**",
      "<p><strong>a <code>b</code> c</strong></p>",
    ],
    ["an unmatched star stays text", "a * b", "<p>a * b</p>"],
    ["an unmatched backtick stays text", "a ` b", "<p>a ` b</p>"],
    ["empty bold stays text", "a **** b", "<p>a **** b</p>"],
    ["code keeps stars literal", "`a*b*c`", "<p><code>a*b*c</code></p>"],
    [
      "code keeps a link literal",
      "`[a](https://x.fr)`",
      "<p><code>[a](https://x.fr)</code></p>",
    ],
    [
      "quotes and ampersand are text",
      'l\'« a » & "b"',
      '<p>l\'« a » &amp; "b"</p>',
    ],
  ])("renders %s", (_name, input, expected) => {
    expect(html(input)).toBe(expected);
  });
});

describe("md links", () => {
  it("opens an absolute link in a new tab with rel noopener", () => {
    expect(html("[LinkedIn](https://www.linkedin.com/company/x/)")).toBe(
      '<p><a href="https://www.linkedin.com/company/x/" target="_blank" rel="noopener">LinkedIn</a></p>',
    );
  });

  it("does not link an http URL, only https", () => {
    expect(html("[a](http://exemple.ma/p)")).toBe(
      "<p>[a](http://exemple.ma/p)</p>",
    );
  });

  it("keeps an ampersand of the URL in the attribute", () => {
    const { container } = render(<div>{md("[a](https://x.fr/?a=1&b=2)")}</div>);
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "https://x.fr/?a=1&b=2",
    );
  });

  it("links a site route in the same tab", () => {
    const { container } = render(
      <div>{md("[Les formules](/socrates/#sponsoring)")}</div>,
    );
    const a = container.querySelector("a");
    expect(a?.getAttribute("href")).toBe("/socrates/#sponsoring");
    expect(a?.getAttribute("target")).toBeNull();
    expect(a?.textContent).toBe("Les formules");
  });

  it("links an article route", () => {
    const { container } = render(
      <div>{md("[a](/actualites/axa-craftsmanship-a-l-ere-de-l-ia/)")}</div>,
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "/actualites/axa-craftsmanship-a-l-ere-de-l-ia/",
    );
  });

  it.each([["./a"], ["../a"], ["socrates.html#sponsoring"], ["a/b"]])(
    "does not link the relative URL %s",
    (url) => {
      const { container } = render(<div>{md(`[a](${url})`)}</div>);
      expect(container.querySelector("a")).toBeNull();
      expect(container.textContent).toBe(`[a](${url})`);
    },
  );

  it("renders markup inside the link text", () => {
    expect(html("[**gras**](https://x.fr)")).toBe(
      '<p><a href="https://x.fr" target="_blank" rel="noopener"><strong>gras</strong></a></p>',
    );
  });

  it("renders a link inside bold text", () => {
    expect(html("**voir [ici](https://x.fr)**")).toBe(
      '<p><strong>voir <a href="https://x.fr" target="_blank" rel="noopener">ici</a></strong></p>',
    );
  });

  it("keeps stars of the URL out of the emphasis rules", () => {
    const { container } = render(
      <div>{md("*a* [b](https://x.fr/*c*) *d*")}</div>,
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "https://x.fr/*c*",
    );
    expect(container.querySelectorAll("em")).toHaveLength(2);
  });

  it("does not link a URL with a space", () => {
    expect(html("[a](https://x.fr/a b)")).toBe("<p>[a](https://x.fr/a b)</p>");
  });
});

describe("md unsafe input", () => {
  it("shows html tags as text", () => {
    const { container } = render(<div>{md("<script>alert(1)</script>")}</div>);
    expect(container.querySelector("script")).toBeNull();
    expect(container.firstElementChild?.innerHTML).toBe(
      "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
    );
  });

  it("shows an img tag with an event handler as text", () => {
    const { container } = render(
      <div>{md('<img src=x onerror="alert(1)">')}</div>,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("p")?.textContent).toBe(
      '<img src=x onerror="alert(1)">',
    );
  });

  it("shows html tags inside bold text and headings as text", () => {
    const { container } = render(
      <div>{md("## <b>x</b>\n\n**<i>y</i>**")}</div>,
    );
    expect(container.querySelector("b")).toBeNull();
    expect(container.querySelector("i")).toBeNull();
    expect(container.querySelector("h2")?.textContent).toBe("<b>x</b>");
    expect(container.querySelector("strong")?.textContent).toBe("<i>y</i>");
  });

  it.each([
    ["javascript:alert(1)"],
    ["JAVASCRIPT:alert(1)"],
    ["data:text/html,x"],
    ["vbscript:x"],
    ["//evil.example"],
    ["https:evil"],
  ])("does not make a link of the URL %s", (url) => {
    const { container } = render(<div>{md(`[clic](${url})`)}</div>);
    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toBe(`[clic](${url})`);
  });

  it("does not let the input forge an internal marker", () => {
    const { container } = render(<div>{md("a a0 b a c0")}</div>);
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("code")).toBeNull();
    expect(container.textContent).toBe("a a0 b a c0");
  });
});

describe("md on an article body", () => {
  const body = [
    "Introduction avec un [lien](/socrates/#sponsoring).",
    "",
    "## Premier titre",
    "",
    "- un",
    "- deux",
    "- trois",
    "",
    "Conclusion.",
  ].join("\n");

  it("renders paragraphs, a heading, a list and an internal link in order", () => {
    const { container } = render(<div>{md(body)}</div>);
    expect(
      [...(container.firstElementChild?.children ?? [])].map(
        (el) => el.tagName,
      ),
    ).toEqual(["P", "H2", "UL", "P"]);
    expect(container.querySelector("h2")?.textContent).toBe("Premier titre");
    expect(container.querySelectorAll("li")).toHaveLength(3);
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "/socrates/#sponsoring",
    );
  });
});

describe("md on the real articles", () => {
  it("renders one block per blank-line-separated chunk of every article body", () => {
    for (const article of loadArticles().items) {
      const chunks = article.body.trim().split(/\r?\n\s*\r?\n/);
      const { container, unmount } = render(<div>{md(article.body)}</div>);
      expect(container.firstElementChild?.children, article.slug).toHaveLength(
        chunks.length,
      );
      expect(container.querySelector("script"), article.slug).toBeNull();
      unmount();
    }
  });
});

describe("md french spacing", () => {
  // From articles.json (appel-partenaires-socrates-5e-edition): a plain space
  // before the colon becomes U+202F, as the old site did on every text node.
  it("uses a narrow no-break space before ? ! : ;", () => {
    expect(html("est à but non lucratif : le prix")).toBe(
      "<p>est à but non lucratif\u202f: le prix</p>",
    );
    expect(html("a ? b ! c ; d")).toBe("<p>a\u202f? b\u202f! c\u202f; d</p>");
  });

  it("applies to headings, list items and link text", () => {
    expect(html("## Pourquoi : ici")).toBe("<h2>Pourquoi\u202f: ici</h2>");
    expect(html("- tests : oui")).toBe("<ul><li>tests\u202f: oui</li></ul>");
    expect(html("[voir : ici](https://x.fr)")).toBe(
      '<p><a href="https://x.fr" target="_blank" rel="noopener">voir\u202f: ici</a></p>',
    );
  });

  it("leaves code spans and hrefs untouched", () => {
    expect(html("`a : b`")).toBe("<p><code>a : b</code></p>");
    const { container } = render(
      <div>{md("[x](https://x.fr/p?a=1;b:2)")}</div>,
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "https://x.fr/p?a=1;b:2",
    );
  });
});

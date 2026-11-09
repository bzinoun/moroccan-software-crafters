// French typography (frenchSpacing).
// A normal or no-break space before ? ! : ; becomes a narrow no-break space
// (U+202F), so the punctuation never wraps alone. Apply it to rendered text
// only, never to hrefs or other attributes.

const BEFORE_PUNCTUATION = /[  ]([?!:;])/g;

export function frenchSpacing(text: string): string {
  return text.replace(BEFORE_PUNCTUATION, " $1");
}

/** "1 inscrit", "2 inscrits": French uses the singular for 0 and 1. */
export function countLabel(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count < 2 ? singular : plural}`;
}

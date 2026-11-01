// French typography, ported from `assets/js/cms.js` (frenchSpacing).
// A normal or no-break space before ? ! : ; becomes a narrow no-break space
// (U+202F), so the punctuation never wraps alone. Apply it to rendered text
// only, never to hrefs or other attributes.

const BEFORE_PUNCTUATION = /[  ]([?!:;])/g;

export function frenchSpacing(text: string): string {
  return text.replace(BEFORE_PUNCTUATION, " $1");
}
